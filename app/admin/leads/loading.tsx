export default function LeadsLoading() {
  return (
    <main className="container py-14" aria-busy="true">
      <p className="text-sm uppercase tracking-[.12em] text-teal-700">Lead CRM</p>
      <p role="status" className="mt-2 font-display text-5xl text-navy-900">
        Loading website requests…
      </p>
      <div className="mt-8 h-48 animate-pulse rounded-3xl bg-white motion-reduce:animate-none" />
    </main>
  );
}
