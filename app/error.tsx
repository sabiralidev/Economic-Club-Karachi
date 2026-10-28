"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Public page rendering error", error);
  }, [error]);

  return (
    <section className="grid min-h-[70vh] place-items-center bg-brand-paper px-5 py-20 sm:px-8">
      <div className="max-w-xl text-center">
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="font-display mt-4 text-4xl leading-[1.1] text-brand-purple sm:text-5xl">
          This page could not be loaded.
        </h1>
        <p className="mt-4 text-base leading-7 text-brand-ink/70">
          Please try again. No details about this error have been exposed.
        </p>
        <Button className="mt-8" onClick={() => reset()} type="button" variant="dark">
          Try again
        </Button>
      </div>
    </section>
  );
}
