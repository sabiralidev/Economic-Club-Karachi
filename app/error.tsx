"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Public page rendering error", error);
  }, [error]);

  return (
    <section className="grid min-h-[60vh] place-items-center bg-brand-paper px-5 py-16 text-center">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Something went wrong</p>
        <h1 className="font-display mt-4 text-4xl leading-tight text-brand-purple sm:text-5xl">This page could not be loaded.</h1>
        <p className="mt-4 text-base leading-7 text-brand-ink/70">Please try again. No details about this error have been exposed.</p>
        <button className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md bg-brand-purple px-6 py-3 text-sm font-bold text-white hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e716b]" onClick={() => reset()} type="button">Try again</button>
      </div>
    </section>
  );
}