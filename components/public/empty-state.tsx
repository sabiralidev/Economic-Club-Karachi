import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
};

export function EmptyState({ description, href, linkLabel, title }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-brand-purple/20 bg-white/70 px-6 py-12 text-center sm:px-10 sm:py-16">
      <span aria-hidden="true" className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-purple text-xl text-brand-teal">
        —
      </span>
      <h3 className="font-display mt-5 text-xl text-brand-purple">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-brand-ink/65">{description}</p>
      {href && linkLabel && (
        <Link className="link-underline mt-6 inline-flex w-fit text-sm font-bold text-brand-purple" href={href}>
          {linkLabel} <span aria-hidden="true" className="ml-2">↗</span>
        </Link>
      )}
    </div>
  );
}
