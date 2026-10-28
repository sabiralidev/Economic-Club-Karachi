import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

type SectionHeadingProps = {
  description?: string;
  eyebrow?: string;
  title: ReactNode;
  tone?: "light" | "dark";
  size?: "md" | "lg";
  align?: "left" | "center";
  /** Trailing content aligned beside the heading on wide screens (e.g. a link). */
  actions?: ReactNode;
  className?: string;
  titleId?: string;
};

const titleSizes = {
  md: "text-3xl sm:text-4xl",
  lg: "text-4xl sm:text-5xl",
};

export function SectionHeading({
  actions,
  align = "left",
  className = "",
  description,
  eyebrow,
  size = "lg",
  title,
  titleId,
  tone = "light",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const body = (
    <div className={align === "center" ? "mx-auto text-center" : ""}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={`font-display mt-4 max-w-3xl leading-[1.1] ${titleSizes[size]} ${dark ? "text-white" : "text-brand-purple"} ${align === "center" ? "mx-auto" : ""}`}
        id={titleId}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${dark ? "text-white/72" : "text-brand-ink/72"} ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );

  if (!actions) {
    return <div className={className}>{body}</div>;
  }

  return (
    <div className={`flex flex-col gap-8 md:flex-row md:items-end md:justify-between ${className}`}>
      {body}
      <div className="shrink-0">{actions}</div>
    </div>
  );
}
