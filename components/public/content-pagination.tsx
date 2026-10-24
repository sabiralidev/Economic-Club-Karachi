import Link from "next/link";

type ContentPaginationProps = {
  pathname: string;
  page: number;
  pages: number;
  query?: Record<string, string | undefined>;
};

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
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between border-t border-brand-purple/10 pt-5">
      {page > 1
        ? <Link className="text-sm font-semibold text-brand-purple underline underline-offset-4" href={href(page - 1)}>Previous</Link>
        : <span className="text-sm text-brand-ink/40">Previous</span>}
      <span aria-current="page" className="text-sm text-brand-ink/70">Page {page} of {pages}</span>
      {page < pages
        ? <Link className="text-sm font-semibold text-brand-purple underline underline-offset-4" href={href(page + 1)}>Next</Link>
        : <span className="text-sm text-brand-ink/40">Next</span>}
    </nav>
  );
}
