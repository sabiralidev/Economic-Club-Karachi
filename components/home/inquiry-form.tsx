"use client";

import { useRef, useState, type FormEvent } from "react";

type InquiryPurpose = "general" | "membership" | "partnership" | "services";

type InquiryFormProps = {
  defaultMessage?: string;
  defaultPurpose?: InquiryPurpose;
  application?: boolean;
  eventSlug?: string;
};

export function InquiryForm({ defaultMessage = "", defaultPurpose = "general", application = false, eventSlug }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const idempotencyKey = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(eventSlug ? `/api/events/${encodeURIComponent(eventSlug)}/register` : application ? "/api/applications" : "/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current ?? (idempotencyKey.current = crypto.randomUUID()),
        },
        body: JSON.stringify({
          ...Object.fromEntries(formData.entries()),
          consent: formData.get("consent") === "on",
          ...(application ? { interest: formData.get("interest") } : {}),
          ...(eventSlug ? { purpose: "event_registration" } : {}),
        }),
      });

      const result: unknown = await response.json();
      if (!response.ok) {
        if (isApiError(result)) {
          setMessage(result.error.message);
          if (result.error.issues) {
            setFieldErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path.join("."), issue.message])));
          }
        } else {
          setMessage("We could not submit this form. Please try again.");
        }
        setStatus("error");
        return;
      }
      form.reset();
      idempotencyKey.current = null;
      setMessage(application ? "Thank you. Your application has been received for review." : eventSlug ? "Thank you. Your registration request has been received." : "Thank you. Your enquiry has been received.");
      setStatus("success");
    } catch {
      setMessage("We could not reach the server. Your details are still on this form; please try again.");
      setStatus("error");
    }
  }

  return (
    <form aria-busy={status === "sending"} aria-label={application ? "Membership application" : eventSlug ? "Event registration" : "Contact enquiry"} className="border border-brand-purple/10 bg-brand-paper p-6 sm:p-9" id="inquiry" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2 text-sm font-semibold text-brand-purple">
          <label htmlFor="inquiry-name">Name</label>
          <input autoComplete="name" aria-describedby={fieldErrors.name ? "inquiry-name-error" : undefined} aria-invalid={Boolean(fieldErrors.name)} className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" id="inquiry-name" maxLength={100} name="name" placeholder="Your name" required />
          {fieldErrors.name && <span className="text-xs font-normal text-red-700" id="inquiry-name-error">{fieldErrors.name}</span>}
        </div>
        <div className="grid gap-2 text-sm font-semibold text-brand-purple sm:col-span-2">
          <label htmlFor="inquiry-phone">Phone <span className="font-normal text-brand-ink/55">(optional)</span></label>
          <input autoComplete="tel" aria-describedby={fieldErrors.phone ? "inquiry-phone-error" : undefined} aria-invalid={Boolean(fieldErrors.phone)} className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" id="inquiry-phone" maxLength={30} name="phone" placeholder="Your phone number" type="tel" />
          {fieldErrors.phone && <span className="text-xs font-normal text-red-700" id="inquiry-phone-error">{fieldErrors.phone}</span>}
        </div>
        <div className="grid gap-2 text-sm font-semibold text-brand-purple">
          <label htmlFor="inquiry-email">Email</label>
          <input autoComplete="email" aria-describedby={fieldErrors.email ? "inquiry-email-error" : undefined} aria-invalid={Boolean(fieldErrors.email)} className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" id="inquiry-email" maxLength={254} name="email" placeholder="you@example.com" required type="email" />
          {fieldErrors.email && <span className="text-xs font-normal text-red-700" id="inquiry-email-error">{fieldErrors.email}</span>}
        </div>
      </div>
      {!eventSlug && <div className="mt-5 grid gap-2 text-sm font-semibold text-brand-purple">
        <label htmlFor={application ? "inquiry-interest" : "inquiry-purpose"}>{application ? "Area of interest" : "I'm interested in"}</label>
        <select aria-describedby={fieldErrors[application ? "interest" : "purpose"] ? "inquiry-category-error" : undefined} aria-invalid={Boolean(fieldErrors[application ? "interest" : "purpose"])} className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink outline-none transition focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" defaultValue={application ? "membership" : defaultPurpose} id={application ? "inquiry-interest" : "inquiry-purpose"} name={application ? "interest" : "purpose"}>
          {application ? <>
            <option value="membership">Membership information</option>
            <option value="volunteering">Volunteering</option>
            <option value="partnership">Partnership</option>
            <option value="general">General participation</option>
          </> : <>
            <option value="general">A general enquiry</option>
            <option value="membership">Membership information</option>
            <option value="partnership">A possible partnership</option>
            <option value="services">Discussing an idea</option>
          </>}
        </select>
        {fieldErrors[application ? "interest" : "purpose"] && <span className="text-xs font-normal text-red-700" id="inquiry-category-error">{fieldErrors[application ? "interest" : "purpose"]}</span>}
      </div>}
      <div className="mt-5 grid gap-2 text-sm font-semibold text-brand-purple">
        <label htmlFor="inquiry-message">Message</label>
        <textarea aria-describedby={fieldErrors.message ? "inquiry-message-error" : undefined} aria-invalid={Boolean(fieldErrors.message)} className="min-h-32 resize-y rounded-sm border border-brand-purple/15 bg-white px-4 py-3 font-normal leading-6 text-brand-ink outline-none transition placeholder:text-brand-ink/40 focus:border-[#0e716b] focus:ring-2 focus:ring-[#0e716b]/15" defaultValue={defaultMessage} id="inquiry-message" maxLength={3000} minLength={10} name="message" placeholder="How can ECK help?" required rows={4} />
        {fieldErrors.message && <span className="text-xs font-normal text-red-700" id="inquiry-message-error">{fieldErrors.message}</span>}
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-brand-ink/70">
        <input aria-describedby={fieldErrors.consent ? "inquiry-consent-error" : undefined} aria-invalid={Boolean(fieldErrors.consent)} className="mt-1 h-4 w-4 accent-brand-purple" id="inquiry-consent" name="consent" required type="checkbox" />
        <span>I agree that ECK may use these details to respond to my enquiry. See the <a className="underline underline-offset-2" href="/privacy">privacy notice</a>.</span>
      </label>
      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-purple px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e716b] disabled:cursor-wait disabled:opacity-60" disabled={status === "sending"} type="submit">
          {status === "sending" ? "Sending…" : application ? "Send application" : eventSlug ? "Request registration" : "Send enquiry"}
        </button>
        <p aria-live="polite" className="min-h-5 text-sm text-brand-ink/70" role="status">
          {message}
        </p>
      </div>
      {fieldErrors.consent && <p className="mt-2 text-sm text-red-700" id="inquiry-consent-error">{fieldErrors.consent}</p>}
      <p className="mt-5 text-xs leading-5 text-brand-ink/55">Please avoid including sensitive personal or financial information.</p>
    </form>
  );
}

function isApiError(value: unknown): value is {
  error: { message: string; issues?: { path: (string | number)[]; message: string }[] };
} {
  return typeof value === "object" && value !== null && "error" in value
    && typeof value.error === "object" && value.error !== null && "message" in value.error
    && typeof value.error.message === "string";
}