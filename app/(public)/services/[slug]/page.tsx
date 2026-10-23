import Link from "next/link";
import { notFound } from "next/navigation";

const themes: Record<string, { title: string; description: string }> = {
  "ideas-and-dialogue": {
    title: "Ideas & dialogue",
    description: "A proposed space for thoughtful exchange on issues shaping business and community life.",
  },
  "community-initiatives": {
    title: "Community initiatives",
    description: "A proposed focus on community-minded work, to be shaped with ECK and its stakeholders.",
  },
  "professional-connection": {
    title: "Professional connection",
    description: "A proposed opportunity to explore how people and organizations might connect through ECK.",
  },
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = themes[slug];
  if (!theme) notFound();

  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Proposed theme · for ECK review</p>
        <h1 className="font-display text-4xl leading-tight text-brand-purple sm:text-6xl">{theme.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-ink/75">{theme.description}</p>
        <div className="mt-9 border-l-2 border-brand-teal pl-5 text-sm leading-6 text-brand-ink/65">
          This page describes an editorial direction for discussion only. It is not a confirmed ECK service or active programme. Please ask the organization about current work.
        </div>
        <Link className="mt-9 inline-flex min-h-12 items-center justify-center rounded-md bg-brand-purple px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e716b]" href={`/contact?topic=${slug}#inquiry`}>
          Ask ECK about this theme
        </Link>
      </div>
    </section>
  );
}
