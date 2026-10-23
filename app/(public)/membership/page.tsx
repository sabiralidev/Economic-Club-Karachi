import { InquiryForm } from "@/components/home/inquiry-form";

export const metadata = { title: "Membership" };

export default function MembershipPage() {
  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Membership interest</p>
          <h1 className="font-display text-4xl leading-tight text-brand-purple sm:text-5xl">Let&apos;s begin with an introduction.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-brand-ink/70">
            Share your interest with ECK and ask for current details. Membership eligibility, benefits, fees and application steps have not yet been confirmed.
          </p>
        </div>
        <InquiryForm defaultPurpose="membership" />
      </div>
    </section>
  );
}
