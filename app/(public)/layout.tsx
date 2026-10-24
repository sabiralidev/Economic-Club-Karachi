import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <ScrollReveal animateSections className="contents">{children}</ScrollReveal>;
}