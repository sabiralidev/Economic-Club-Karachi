import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={`rounded-2xl border border-brand-purple/10 bg-white p-7 shadow-card ${className}`}
      {...props}
    />
  );
}
