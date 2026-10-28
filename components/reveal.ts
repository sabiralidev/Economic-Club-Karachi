/**
 * Shared, lazily-created IntersectionObserver used by the site's entrance reveals.
 *
 * A single observer instance handles every element on the page, so revealing a
 * section costs nothing more than a class toggle — no layout thrash and no React
 * renders during scroll. Elements are unobserved as soon as they have appeared.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries, instance) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        instance.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
  );
  return observer;
}

export function observeReveal(element: HTMLElement, delayMs = 0) {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    element.classList.add("is-revealed");
    return () => {};
  }

  if (delayMs > 0) element.style.transitionDelay = `${delayMs}ms`;

  const instance = getObserver();
  instance.observe(element);

  return () => instance.unobserve(element);
}
