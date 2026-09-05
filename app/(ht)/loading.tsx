import { Spinner } from "@/components/ui/spinner";

/** Haitian Creole route-transition fallback — mirrors app/(pt)/loading.tsx,
 * with the screen-reader-only status text in Haitian Creole so it matches
 * the document's `lang="ht"`. */
export default function HtLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <Spinner className="h-10 w-10 text-navy-900" />
      <span className="sr-only">Ap chaje…</span>
    </div>
  );
}
