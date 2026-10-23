"use client";

import { useState, type FormEvent } from "react";

type InquiryPurpose = "general" | "membership" | "partnership" | "services";

type InquiryFormProps = {
  defaultPurpose?: InquiryPurpose;
};

export function InquiryForm({ defaultPurpose = "general" }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (!response.ok) throw new Error("Inquiry could not be submitted");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="border border-brand-purple/10 bg-brand-paper p-6 sm:p-9" id="inquiry" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="inquiry-name">
          Name
          <input autoComplete="name" className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" id="inquiry-name" maxLength={100} name="name" placeholder="Your name" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="inquiry-email">
          Email
          <input autoComplete="email" className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" id="inquiry-email" maxLength={254} name="email" placeholder="you@example.com" required type="email" />
        </label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="inquiry-purpose">
        I&apos;m interested in
        <select className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink outline-none transition focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" defaultValue={defaultPurpose} id="inquiry-purpose" name="purpose">
          <option value="general">A general enquiry</option>
          <option value="membership">Membership information</option>
          <option value="partnership">A possible partnership</option>
          <option value="services">Discussing an idea</option>
        </select>
      </label>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="inquiry-message">
        Message
        <textarea className="min-h-32 resize-y rounded-sm border border-brand-purple/15 bg-white px-4 py-3 font-normal leading-6 text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" id="inquiry-message" maxLength={3000} name="message" placeholder="How can ECK help?" required rows={4} />
      </label>
      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-purple px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e716b] disabled:cursor-wait disabled:opacity-60" disabled={status === "sending"} type="submit">
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p aria-live="polite" className="min-h-5 text-sm text-brand-ink/70" role="status">
          {status === "success" && "Thank you. Your enquiry has been received."}
          {status === "error" && "We could not send this enquiry. Please try again later."}
        </p>
      </div>
      <p className="mt-5 text-xs leading-5 text-brand-ink/55">Please avoid including sensitive personal or financial information.</p>
    </form>
  );
}