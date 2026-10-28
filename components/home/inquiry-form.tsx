"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { controlInvalidClasses, Field, Input, Select, Textarea } from "@/components/ui/field";

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

  const label = application ? "Membership application" : eventSlug ? "Event registration" : "Contact enquiry";
  const selectId = application ? "inquiry-interest" : "inquiry-purpose";
  const selectName = application ? "interest" : "purpose";
  const selectError = fieldErrors[selectName];

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
    <form
      aria-busy={status === "sending"}
      aria-label={label}
      className="border border-brand-purple/10 bg-brand-paper p-6 sm:p-9"
      id="inquiry"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={fieldErrors.name} id="inquiry-name" label="Name">
          <Input
            aria-describedby={fieldErrors.name ? "inquiry-name-error" : undefined}
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="name"
            className={fieldErrors.name ? controlInvalidClasses : ""}
            id="inquiry-name"
            maxLength={100}
            name="name"
            placeholder="Your name"
            required
          />
        </Field>

        <Field error={fieldErrors.email} id="inquiry-email" label="Email">
          <Input
            aria-describedby={fieldErrors.email ? "inquiry-email-error" : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            className={fieldErrors.email ? controlInvalidClasses : ""}
            id="inquiry-email"
            maxLength={254}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </Field>

        <Field
          className="sm:col-span-2"
          error={fieldErrors.phone}
          hint="Optional. Used only to follow up on your enquiry."
          id="inquiry-phone"
          label="Phone"
        >
          <Input
            aria-describedby={fieldErrors.phone ? "inquiry-phone-error" : undefined}
            aria-invalid={Boolean(fieldErrors.phone)}
            autoComplete="tel"
            className={fieldErrors.phone ? controlInvalidClasses : ""}
            id="inquiry-phone"
            maxLength={30}
            name="phone"
            placeholder="Your phone number"
            type="tel"
          />
        </Field>
      </div>

      {!eventSlug && (
        <Field
          className="mt-5"
          error={selectError}
          id={selectId}
          label={application ? "Area of interest" : "I'm interested in"}
        >
          <Select
            aria-describedby={selectError ? `${selectId}-error` : undefined}
            aria-invalid={Boolean(selectError)}
            className={selectError ? controlInvalidClasses : ""}
            defaultValue={application ? "membership" : defaultPurpose}
            id={selectId}
            name={selectName}
          >
            {application ? (
              <>
                <option value="membership">Membership information</option>
                <option value="volunteering">Volunteering</option>
                <option value="partnership">Partnership</option>
                <option value="general">General participation</option>
              </>
            ) : (
              <>
                <option value="general">A general enquiry</option>
                <option value="membership">Membership information</option>
                <option value="partnership">A possible partnership</option>
                <option value="services">Discussing an idea</option>
              </>
            )}
          </Select>
        </Field>
      )}

      <Field className="mt-5" error={fieldErrors.message} id="inquiry-message" label="Message">
        <Textarea
          aria-describedby={fieldErrors.message ? "inquiry-message-error" : undefined}
          aria-invalid={Boolean(fieldErrors.message)}
          className={`min-h-32 ${fieldErrors.message ? controlInvalidClasses : ""}`}
          defaultValue={defaultMessage}
          id="inquiry-message"
          maxLength={3000}
          minLength={10}
          name="message"
          placeholder="How can ECK help?"
          required
          rows={4}
        />
      </Field>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-brand-ink/70">
        <input
          aria-describedby={fieldErrors.consent ? "inquiry-consent-error" : undefined}
          aria-invalid={Boolean(fieldErrors.consent)}
          className="mt-1 h-4 w-4 accent-brand-purple"
          id="inquiry-consent"
          name="consent"
          required
          type="checkbox"
        />
        <span>
          I agree that ECK may use these details to respond to my enquiry. See the{" "}
          <a className="link-underline text-brand-purple" href="/privacy">privacy notice</a>.
        </span>
      </label>
      {fieldErrors.consent && <p className="mt-2 text-sm text-red-700" id="inquiry-consent-error">{fieldErrors.consent}</p>}

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button disabled={status === "sending"} type="submit" variant="dark">
          {status === "sending" ? "Sending…" : application ? "Send application" : eventSlug ? "Request registration" : "Send enquiry"}
        </Button>
        <p aria-live="polite" className="min-h-5 text-sm text-brand-ink/70" role="status">
          {message}
        </p>
      </div>

      <p className="mt-5 text-xs leading-5 text-brand-ink/55">
        Please avoid including sensitive personal or financial information.
      </p>
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
