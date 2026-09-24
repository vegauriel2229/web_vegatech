// src/components/Process.tsx
import { STEPS } from "../lib/content";
import { IconBadge } from "./Icon";
import { Section } from "./Section";

export function Process() {
  return (
    <Section id="como-funciona" title="Cómo trabajamos" intro="Todo se coordina por WhatsApp, de forma simple y sin vueltas.">
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        <span
          aria-hidden="true"
          className="absolute left-[22px] top-6 hidden h-px w-[calc(100%-44px)] bg-linear-to-r from-fuchsia-500/50 via-slate-700 to-cyan-400/50 md:block"
        />
        {STEPS.map(({ icon, title, text }, i) => (
          <li key={title} className="relative flex gap-4 md:flex-col md:gap-5">
            <IconBadge name={icon} className="relative bg-slate-950" />
            <div>
              <h3 className="font-display text-lg font-medium text-white">
                <span className="mr-2 text-fuchsia-400">{i + 1}.</span>
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-400">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
