import Link from "next/link";

type ContentPaginationProps = {
  pathname: string;
  page: number;
  pages: number;
  query?: Record<string, string | undefined>;
};

const navLink =
  "link-underline text-sm font-bold text-brand-purple";
const navDisabled = "text-sm font-medium text-brand-ink/35";

export function ContentPagination({ pathname, page, pages, query = {} }: ContentPaginationProps) {
  if (pages < 2) return null;

  const href = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value && key !== "page") params.set(key, value);
    }
    params.set("page", String(targetPage));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-between gap-4 border-t border-brand-purple/10 pt-6"
    >
      {page > 1 ? (
        <Link className={navLink} href={href(page - 1)} rel="prev">
          <span aria-hidden="true" className="mr-1">←</span> Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={navDisabled}>
          <span aria-hidden="true" className="mr-1">←</span> Previous
        </span>
      )}
      <span aria-current="page" className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink/55">
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <Link className={navLink} href={href(page + 1)} rel="next">
          Next <span aria-hidden="true" className="ml-1">→</span>
        </Link>
      ) : (
        <span aria-disabled="true" className={navDisabled}>
          Next <span aria-hidden="true" className="ml-1">→</span>
        </span>
      )}
    </nav>
  );
}
