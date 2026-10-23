import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "green" | "teal" | "yellow" | "blue";
};

const toneClasses = {
  green: "bg-brand-green/10 text-brand-green",
  teal: "bg-brand-teal/15 text-brand-purple",
  yellow: "bg-brand-yellow/25 text-brand-purple",
  blue: "bg-brand-blue/10 text-brand-blue",
};

export function Badge({ children, className = "", tone = "teal", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
