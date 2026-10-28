"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function AdminLoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        signal: controller.signal,
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: { message?: string } };
        throw new Error(result.error?.message ?? "Sign-in could not be completed.");
      }
      window.location.assign("/admin");
    } catch (submissionError) {
      if (controller.signal.aborted) return;
      setError(submissionError instanceof Error ? submissionError.message : "Sign-in could not be completed.");
      setPending(false);
    }
  }

  return (
    <form className="mt-8 grid gap-5" onSubmit={submit}>
      <Field id="admin-email" label="Email">
        <Input
          autoComplete="username"
          id="admin-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </Field>
      <Field id="admin-password" label="Password">
        <Input
          autoComplete="current-password"
          id="admin-password"
          maxLength={256}
          name="password"
          required
          type="password"
        />
      </Field>
      <Button disabled={pending} type="submit" variant="dark">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p aria-live="polite" className="min-h-5 text-sm text-red-700" role="alert">
        {error}
      </p>
    </form>
  );
}
