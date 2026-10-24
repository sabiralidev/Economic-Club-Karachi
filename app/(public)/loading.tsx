export default function PublicLoading() {
  return (
    <div aria-live="polite" className="mx-auto max-w-content px-5 py-20 sm:px-8" role="status">
      <span className="sr-only">Loading page…</span>
      <div className="h-3 w-32 animate-pulse rounded-full bg-brand-purple/15" />
      <div className="mt-6 h-10 w-3/4 animate-pulse rounded-sm bg-brand-purple/10" />
      <div className="mt-5 h-4 w-full max-w-2xl animate-pulse rounded-sm bg-brand-purple/10" />
      <div className="mt-3 h-4 w-2/3 max-w-xl animate-pulse rounded-sm bg-brand-purple/10" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div className="h-44 animate-pulse rounded-md border border-brand-purple/10 bg-white" key={index} />
        ))}
      </div>
    </div>
  );
}
