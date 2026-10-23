import Link from "next/link";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  const themes = [
    { slug: "ideas-and-dialogue", title: "Ideas & dialogue", description: "A proposed space for thoughtful exchange on issues shaping business and community life." },
    { slug: "community-initiatives", title: "Community initiatives", description: "A proposed focus on community-minded work, to be shaped with ECK and its stakeholders." },
    { slug: "professional-connection", title: "Professional connection", description: "A proposed opportunity to explore how people and organizations might connect through ECK." },
  ];

  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Possible areas of work</p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-brand-purple sm:text-6xl">A starting point for what ECK may explore.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-brand-ink/70">These working themes are not confirmed services or current programmes. Their content needs review with ECK.</p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {themes.map((theme) => (
            <article className="home-card flex min-h-[260px] flex-col border-t-2 border-brand-purple/15 bg-white p-6 sm:p-8" key={theme.slug}>
              <h2 className="text-xl font-semibold text-brand-purple">{theme.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-brand-ink/70">{theme.description}</p>
              <Link className="editorial-link mt-6 w-fit text-sm font-bold text-brand-purple underline" href={`/services/${theme.slug}`}>Explore proposed theme <span aria-hidden="true" className="ml-1">↗</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
