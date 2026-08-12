import { defineConfig } from "vitest/config";

/** Vitest never picked up next.config.ts's Next.js integration, so it has no
 * other way to resolve the "@/*" alias declared in tsconfig.json — every
 * "@/..." import in a test file (or in a module a test imports) failed with
 * "Cannot find package '@/...'" until this existed. `resolve.tsconfigPaths`
 * (native in Vite 8, no plugin needed) reads the same tsconfig.json path
 * mapping Next.js already uses, so the two stay in sync without a second
 * alias list to maintain. */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
  },
});
