import { InquiryForm } from "@/components/home/inquiry-form";

export const metadata = { title: "Contact" };

type ContactPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

const topics = ["general", "membership", "partnership", "services"] as const;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { topic } = await searchParams;
  const defaultPurpose = topics.find((value) => value === topic) ?? "general";

  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Contact ECK</p>
          <h1 className="font-display text-4xl leading-tight text-brand-purple sm:text-5xl">Start with a question.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-brand-ink/70">
            Use this form to ask about Economic Club Karachi, a possible partnership, membership information, or an idea you would like to discuss.
          </p>
          <p className="mt-5 max-w-md text-sm leading-6 text-brand-ink/60">
            Official contact details and response-time expectations have not yet been confirmed. The team can provide current information after your enquiry is received.
          </p>
        </div>
        <InquiryForm defaultPurpose={defaultPurpose} />
      </div>
    </section>
  );
}
