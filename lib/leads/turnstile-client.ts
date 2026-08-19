"use client";

// Minimal surface of window.turnstile actually used here — the real global
// (loaded by components/analytics/turnstile-script.tsx) has a larger API.
interface TurnstileGlobal {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileGlobal;
  }
}

let widgetId: string | null = null;
let scriptReadyPromise: Promise<void> | null = null;
let pendingResolve: ((token: string) => void) | null = null;
let pendingReject: ((error: Error) => void) | null = null;

function settlePending(token: string | null, error?: Error) {
  const resolve = pendingResolve;
  const reject = pendingReject;
  pendingResolve = null;
  pendingReject = null;
  if (error) reject?.(error);
  else if (token !== null) resolve?.(token);
}

// turnstile-script.tsx loads the script async — poll rather than relying on
// a load event, since getTurnstileToken() can be called before or after
// that script tag finishes (a fast typer can submit before it's ready).
function waitForScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptReadyPromise) return scriptReadyPromise;
  scriptReadyPromise = new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = () => {
      if (window.turnstile) return resolve();
      if (Date.now() - start > 10000) return reject(new Error("turnstile_script_timeout"));
      setTimeout(poll, 100);
    };
    poll();
  });
  return scriptReadyPromise;
}

// Rendered once, invisibly, and reused for every submit on the page via
// execute() below — size: "invisible" plus execution: "execute" means it
// never paints anything and never runs on its own; each submit explicitly
// triggers exactly one fresh, single-use token instead of a widget per
// LeadForm instance (this site can render several in one page: e.g. a
// hero's on-page form plus its LeadFormPopup).
function ensureWidget(): string {
  if (widgetId) return widgetId;
  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);
  widgetId = window.turnstile!.render(container, {
    sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    size: "invisible",
    execution: "execute",
    callback: (token: string) => settlePending(token),
    "error-callback": () => settlePending(null, new Error("turnstile_error")),
    "timeout-callback": () => settlePending(null, new Error("turnstile_timeout")),
  });
  return widgetId;
}

/** Returns a fresh, single-use Turnstile token for one submit, or "" if no
 * site key is configured (matches the server's own unset-secret bypass —
 * see lib/leads/turnstile.ts) or if the widget fails for any reason. Never
 * throws: a Turnstile hiccup should degrade to "server treats this
 * submission as unverified," not break the submit button. */
export async function getTurnstileToken(): Promise<string> {
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return "";
  try {
    await waitForScript();
    const id = ensureWidget();
    return await new Promise<string>((resolve, reject) => {
      pendingResolve = resolve;
      pendingReject = reject;
      // reset() first: execute() on an already-consumed widget would
      // otherwise resolve with a stale, single-use token from the previous
      // submit instead of generating a fresh one.
      window.turnstile!.reset(id);
      window.turnstile!.execute(id);
    });
  } catch {
    return "";
  }
}
