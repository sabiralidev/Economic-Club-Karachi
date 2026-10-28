import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type FilterBarProps = {
  action: string;
  children: ReactNode;
  /** Submit button label, e.g. "Search" or "Filter". */
  submitLabel: string;
  /** Tailwind classes describing the responsive field grid. */
  layout?: string;
  className?: string;
};

/**
 * Shared server-submitted filter form used by the services, events, insights
 * and gallery listings so every search bar looks and behaves the same.
 */
export function FilterBar({
  action,
  children,
  className = "",
  layout = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  submitLabel,
}: FilterBarProps) {
  return (
    <form action={action} className={`border-b border-brand-purple/10 pb-6 ${className}`}>
      <div className={layout}>{children}</div>
      <div className="mt-5 flex justify-end">
        <Button size="md" type="submit" variant="dark">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
