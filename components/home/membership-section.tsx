import { InquiryForm } from "@/components/home/inquiry-form";

export function MembershipSection() {
  return (
    <section className="bg-white py-20 sm:py-28" id="membership-interest">
      <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Membership & partnership</p>
          <h2 className="font-display max-w-lg text-4xl leading-tight text-brand-purple sm:text-5xl">Interested in being part of the conversation?</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-brand-ink/70">
            Share your interest with ECK. Membership eligibility, benefits and partnership arrangements have not yet been confirmed, so the team can follow up with current details.
          </p>
        </div>
        <InquiryForm defaultPurpose="membership" />
      </div>
    </section>
  );
}