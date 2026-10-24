"use client";

import { useState, type FormEvent } from "react";

export function AdminLoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      if (!response.ok) {
        const result = await response.json() as { error?: { message?: string } };
        throw new Error(result.error?.message ?? "Sign-in could not be completed.");
      }
      window.location.assign("/admin");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Sign-in could not be completed.");
      setPending(false);
    }
  }

  return (
    <form className="mt-8 grid gap-5" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="admin-email">
        Email
        <input autoComplete="username" className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink" id="admin-email" maxLength={254} name="email" required type="email" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="admin-password">
        Password
        <input autoComplete="current-password" className="min-h-12 rounded-sm border border-brand-purple/15 bg-white px-4 font-normal text-brand-ink" id="admin-password" maxLength={256} name="password" required type="password" />
      </label>
      <button className="min-h-12 rounded-md bg-brand-purple px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p aria-live="polite" className="min-h-5 text-sm text-red-700" role="alert">{error}</p>
    </form>
  );
}
