// src/components/Faq.tsx
import { ChevronDown } from "lucide-react";
import { FAQ } from "../lib/content";
import { Section } from "./Section";

export function Faq() {
  return (
    <Section id="faq" title="Preguntas frecuentes" className="max-w-[820px]">
      <div className="space-y-3">
        {FAQ.map(({ question, answer }) => (
          <details
            key={question}
            className="group rounded-2xl border border-slate-800 bg-slate-900/50 transition-colors open:border-fuchsia-500/40 hover:border-fuchsia-500/30"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-white [&::-webkit-details-marker]:hidden">
              {question}
              <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-fuchsia-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-sm text-slate-400">{answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
