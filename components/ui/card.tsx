import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  /** Adds the shared hover lift used across content cards. */
  interactive?: boolean;
};

export function Card({ className = "", interactive = false, ...props }: CardProps) {
  return (
    <article
      className={`border border-brand-purple/10 bg-white ${interactive ? "home-card" : ""} ${className}`}
      {...props}
    />
  );
}
