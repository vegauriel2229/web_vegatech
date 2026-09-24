// src/components/Section.tsx
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface SectionProps {
  id: string;
  title: string;
  intro?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, title, intro, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-[1100px] px-4 py-20", className)}>
      <h2 className="font-display text-3xl font-medium tracking-tight text-white md:text-4xl">{title}</h2>
      {intro && <p className="mt-3 max-w-xl text-slate-400">{intro}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

/** Superficie común de tarjetas: vidrio oscuro con borde que se ilumina en magenta al pasar el cursor. */
export const cardSurface =
  "rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.12)]";
