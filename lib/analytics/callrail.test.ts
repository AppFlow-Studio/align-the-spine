import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  CALLRAIL_ALLOWED_HOSTS,
  CALLRAIL_COMPANY_ID,
  CALLRAIL_SWAP_SRC,
  CALLRAIL_SWAP_TOKEN,
  CALLRAIL_SWAP_VERSION,
  isCallRailHost,
} from "./callrail";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

function sourceFiles(directory: string): string[] {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    if (!entry.isFile() || ![".js", ".jsx", ".ts", ".tsx"].includes(extname(entry.name))) return [];
    if (/\.test\.[jt]sx?$/.test(entry.name)) return [];
    return [path];
  });
}

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("CallRail DNI configuration", () => {
  it("pins the authoritative snippet identity and HTTPS URL", () => {
    expect(CALLRAIL_COMPANY_ID).toBe("279230533");
    expect(CALLRAIL_SWAP_TOKEN).toBe("6c157f06de9cb3952db3");
    expect(CALLRAIL_SWAP_VERSION).toBe("12");
    expect(CALLRAIL_SWAP_SRC).toBe(
      "https://cdn.callrail.com/companies/279230533/6c157f06de9cb3952db3/12/swap.js",
    );
  });

  it("allows only the two production hosts, case-insensitively", () => {
    expect(CALLRAIL_ALLOWED_HOSTS).toEqual(["chirobackpain.com", "www.chirobackpain.com"]);
    for (const hostname of [
      "chirobackpain.com",
      "www.chirobackpain.com",
      "CHIROBACKPAIN.COM",
      "WWW.ChiroBackPain.Com",
    ]) {
      expect(isCallRailHost(hostname)).toBe(true);
    }

    for (const hostname of [
      "localhost",
      "127.0.0.1",
      "align-the-spine.vercel.app",
      "chirobackpain.com.evil.test",
      "notchirobackpain.com",
      "alignthespinechiropractic.com",
    ]) {
      expect(isCallRailHost(hostname)).toBe(false);
    }
  });
});

describe("CallRail DNI integration contract", () => {
  const componentPath = "components/analytics/callrail-script.tsx";
  const component = read(componentPath);

  it.each(["en", "es", "ht", "pt"])("mounts exactly once in the %s root layout", (locale) => {
    const layout = read(`app/(${locale})/layout.tsx`);
    expect(layout.match(/<CallRailScript\s*\/>/g)).toHaveLength(1);
  });

  it("uses next/script after hydration without inline script content", () => {
    expect(component).toContain('import Script from "next/script"');
    expect(component).toContain('id="callrail-dni"');
    expect(component).toContain("src={CALLRAIL_SWAP_SRC}");
    expect(component).toContain('strategy="afterInteractive"');
    expect(component).not.toContain("dangerouslySetInnerHTML");
  });

  it("gates admin, preview, and non-production hosts", () => {
    expect(component).toContain('pathname.startsWith("/admin")');
    expect(component).toContain('pathname.startsWith("/preview")');
    expect(component).toContain("useState(false)");
    expect(component).toMatch(
      /useEffect\(\(\) => \{[\s\S]*window\.location\.hostname[\s\S]*\}, \[\]\)/,
    );
  });

  it("defines the CallRail CDN hostname in exactly one non-test module", () => {
    const matches = ["app", "components", "content", "lib"]
      .flatMap(sourceFiles)
      .filter((path) => read(path).includes("cdn.callrail.com"));
    expect(matches).toEqual([join("lib", "analytics", "callrail.ts")]);
  });

  it("keeps the real office number as the sole application-source phone target", () => {
    const site = read("content/site.ts");
    expect(site).toContain('phone: "954-282-1801"');
    expect(site).toContain('phoneHref: "tel:+19542821801"');

    const prohibitedNumbers = [
      "9549513832",
      "9543242347",
      "9544487454",
      "9544667067",
      "9544669570",
      "9545737192",
    ];
    const sources = ["app", "components", "content", "lib"].flatMap(sourceFiles);
    for (const path of sources) {
      const digitsOnly = stripComments(read(path)).replace(/\D/g, "");
      for (const number of prohibitedNumbers) expect(digitsOnly, path).not.toContain(number);
    }
  });

  it("does not connect CallRail to lead or advertising data", () => {
    const code = stripComments(component);
    for (const prohibited of [
      "lead_priority",
      "classifyLeadPriority",
      "carAccident",
      "@/lib/leads",
      "@/content/lead-forms",
      "getStoredAttribution",
      "CallTrk",
      "custom_fields",
      "dataLayer",
    ]) {
      expect(code).not.toContain(prohibited);
    }
  });
});
