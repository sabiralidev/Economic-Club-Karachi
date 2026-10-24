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
          <Link className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" href="/">Home</Link>
        </li>
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
            <span aria-hidden="true">/</span>
            {item.href && index < items.length - 1 ? (
              <Link className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-white/85">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}