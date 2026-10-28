import type { ElementType, ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /** `dark` renders the teal tone used on the purple sections. */
  tone?: "light" | "dark";
  as?: ElementType;
};

export function Eyebrow({ children, className = "", tone = "light", as: Tag = "p" }: EyebrowProps) {
  return (
    <Tag className={`eyebrow ${tone === "dark" ? "eyebrow-on-dark" : ""} ${className}`}>{children}</Tag>
  );
}
