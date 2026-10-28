import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type ContentCardProps = {
  title: string;
  /** Small uppercase line above the title (category, date, status…). */
  meta: string;
  description: string;
  href: string;
  linkLabel: string;
  image?: string;
  imageSizes?: string;
  headingLevel?: 2 | 3;
  className?: string;
};

/**
 * The single listing card used across services, events, insights and the home
 * page, so card rhythm and hover behaviour never drift between sections.
 */
export function ContentCard({
  className = "",
  description,
  headingLevel = 2,
  href,
  image,
  imageSizes = "(max-width: 768px) 100vw, 50vw",
  linkLabel,
  meta,
  title,
}: ContentCardProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <Card className={`group flex flex-col overflow-hidden ${className}`} interactive>
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            alt={title}
            className="object-cover"
            fill
            sizes={imageSizes}
            src={image}
            unoptimized={image.startsWith("https://")}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {meta && (
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-teal-deep">{meta}</p>
        )}
        <Heading className="font-display mt-3 text-xl leading-snug text-brand-purple sm:text-2xl">{title}</Heading>
        <p className="mt-3 flex-1 text-sm leading-6 text-brand-ink/70">{description}</p>
        <Link className="link-underline mt-5 inline-flex w-fit text-sm font-bold text-brand-purple" href={href}>
          {linkLabel}
          <span aria-hidden="true" className="ml-2 transition-transform duration-200 ease-out-soft group-hover:translate-x-1">↗</span>
        </Link>
      </div>
    </Card>
  );
}
