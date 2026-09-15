/** Tiny shared external store tracking whether any site-chrome overlay
 * (the mobile nav drawer, a LeadFormPopup dialog, ...) is currently open —
 * so an unrelated component (MobileConversionBar, ATS-SEO-093) can hide
 * itself while one is up instead of stacking a second competing CTA on top
 * of it. A Set of caller-supplied ids rather than a single boolean: two
 * overlays can't accidentally "close" each other by both toggling the same
 * flag, since each only ever adds/removes its own id.
 *
 * useSyncExternalStore, not context: this needs to be read from a component
 * that isn't necessarily under the same provider tree as the overlays that
 * open it (root-shell.tsx mounts them as siblings), and a module-level Set
 * is enough for something this small — no need for a full store library. */
const openOverlayIds = new Set<string>();
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function registerOverlayOpen(id: string) {
  openOverlayIds.add(id);
  notify();
}

export function registerOverlayClosed(id: string) {
  openOverlayIds.delete(id);
  notify();
}

export function subscribeOverlayOpen(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getOverlayOpenSnapshot(): boolean {
  return openOverlayIds.size > 0;
}

export function getOverlayOpenServerSnapshot(): boolean {
  return false;
}
