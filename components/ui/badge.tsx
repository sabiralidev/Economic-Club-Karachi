import type { HTMLAttributes } from "react";

export type BadgeTone = "teal" | "green" | "yellow" | "blue" | "neutral" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  /** Squared hairline chip instead of the default pill. */
  square?: boolean;
};

const toneClasses: Record<BadgeTone, string> = {
  teal: "bg-brand-teal/15 text-brand-purple",
  green: "bg-brand-green/12 text-brand-green",
  yellow: "bg-brand-yellow/25 text-brand-purple",
  blue: "bg-brand-blue/10 text-brand-blue",
  neutral: "bg-brand-ink/[0.06] text-brand-ink/70",
  danger: "bg-red-500/10 text-red-700",
};

export function Badge({ children, className = "", tone = "teal", square = false, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-transparent px-3 py-1 text-xs font-semibold ${square ? "rounded-sm" : "rounded-full"} ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
