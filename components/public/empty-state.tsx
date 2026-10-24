import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
};

export function EmptyState({ title, description, href, linkLabel }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-brand-purple/20 bg-white/70 px-6 py-10 text-center sm:px-10 sm:py-14">
      <span aria-hidden="true" className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-purple text-lg text-brand-teal">—</span>
      <h3 className="mt-5 text-lg font-semibold text-brand-purple">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-brand-ink/65">{description}</p>
      {href && linkLabel && (
        <Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={href}>{linkLabel} <span aria-hidden="true" className="ml-2">↗</span></Link>
      )}
    </div>
  );
}