import { Spinner } from "@/components/ui/spinner";

/** Portuguese route-transition fallback — mirrors app/(es)/loading.tsx, with
 * the screen-reader-only status text in Portuguese so it matches the
 * document's `lang="pt-BR"`. */
export default function PtLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <Spinner className="h-10 w-10 text-navy-900" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
