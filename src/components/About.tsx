// src/components/About.tsx
import { Check } from "lucide-react";
import { ABOUT_PARAGRAPHS, ABOUT_POINTS } from "../lib/content";
import { cn } from "../lib/cn";
import { Section, cardSurface } from "./Section";

export function About() {
  return (
    <Section id="sobre-nosotros" title="Sobre nosotros">
      <div className="grid items-start gap-8 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4 text-slate-400">
          {ABOUT_PARAGRAPHS.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <ul className={cn(cardSurface, "space-y-4 p-6")}>
          {ABOUT_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3 text-slate-200">
              <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-cyan-400" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
