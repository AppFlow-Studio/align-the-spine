"use client";
export default function LeadsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container py-14">
      <h1 className="font-display text-5xl text-navy-900">Leads are temporarily unavailable</h1>
      <p className="mt-3 text-ink-500">No lead data was changed. Try the request again.</p>
      <button
        onClick={reset}
        className="mt-6 min-h-11 rounded-full bg-navy-900 px-5 font-semibold text-white"
      >
        Try again
      </button>
    </main>
  );
}
