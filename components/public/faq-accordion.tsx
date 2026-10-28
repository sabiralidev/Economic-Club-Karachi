export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  title?: string;
};

export function FaqAccordion({ items, title = "Frequently asked questions" }: FaqAccordionProps) {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-brand-purple/10 pt-10">
      <h2 className="font-display text-3xl leading-tight text-brand-purple sm:text-4xl" id="faq-heading">{title}</h2>
      <div className="mt-6 divide-y divide-brand-purple/10 border-t border-brand-purple/10">
        {items.map((item) => (
          <details className="group py-5" key={item.question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-brand-purple marker:hidden [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-brand-purple/15 text-sm text-brand-teal-deep transition-transform duration-300 ease-out-soft group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-ink/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
