type RoutePlaceholderProps = {
  title: string;
  description: string;
};

export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <section className="mx-auto max-w-content px-5 py-20 sm:px-8 sm:py-28">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
        Economic Club Karachi
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-brand-purple sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-ink/70">{description}</p>
      <p className="mt-10 inline-flex rounded-full border border-brand-purple/15 bg-white px-4 py-2 text-sm font-medium text-brand-purple">
        Page foundation — detailed content is planned for a later phase.
      </p>
    </section>
  );
}
