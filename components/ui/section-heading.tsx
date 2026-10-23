type SectionHeadingProps = {
  description?: string;
  eyebrow?: string;
  title: string;
};

export function SectionHeading({ description, eyebrow, title }: SectionHeadingProps) {
  return (
    <div>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">{eyebrow}</p>
      )}
      <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-brand-purple sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-brand-ink/70">{description}</p>
      )}
    </div>
  );
}
