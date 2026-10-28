import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7 text-xs text-white/60">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link className="link-underline transition-colors hover:text-white" href="/">Home</Link>
        </li>
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
            <span aria-hidden="true" className="text-white/30">/</span>
            {item.href && index < items.length - 1 ? (
              <Link className="link-underline transition-colors hover:text-white" href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-white/85">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
