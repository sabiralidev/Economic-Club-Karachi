import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-brand-paper px-5 py-20 sm:px-8">
      <div className="max-w-xl text-center">
        <Eyebrow>404 · Page not found</Eyebrow>
        <h1 className="font-display mt-4 text-4xl leading-[1.1] text-brand-purple sm:text-5xl">
          This page isn&apos;t available.
        </h1>
        <p className="mt-4 text-base leading-7 text-brand-ink/70">
          The address may be incorrect, or the content may not have been published yet.
        </p>
        <ButtonLink className="mt-8" href="/" variant="dark">
          Return home
        </ButtonLink>
      </div>
    </section>
  );
}
