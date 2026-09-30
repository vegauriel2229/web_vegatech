// src/components/Section.tsx
import type { ReactNode } from "react";
import { motion, stagger, type Transition, type Variants } from "motion/react";
import { cn } from "../lib/cn";

interface SectionProps {
  id: string;
  title: string;
  intro?: string;
  className?: string;
  /** Entra con fade + subida la primera vez que aparece en pantalla. Los hijos con `revealVariants` entran después, en cascada. */
  reveal?: boolean;
  children: ReactNode;
}

// Mismo movimiento que los pasos de Process. Con reducedMotion="user" (main.tsx) Motion omite la subida y deja solo el fade.
const REVEAL_TRANSITION: Transition = { duration: 0.5, ease: "easeOut" };

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
};

const SECTION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ...REVEAL_TRANSITION, delayChildren: stagger(0.12, { startDelay: 0.2 }) } },
};

const REVEAL_PROPS = { variants: SECTION_VARIANTS, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 } } as const;

export function Section({ id, title, intro, className, reveal = false, children }: SectionProps) {
  return (
    <motion.section id={id} className={cn("mx-auto w-full max-w-[1100px] px-4 py-20", className)} {...(reveal ? REVEAL_PROPS : {})}>
      <h2 className="font-display text-3xl font-medium tracking-tight text-white md:text-4xl">{title}</h2>
      {intro && <p className="mt-3 max-w-xl text-slate-400">{intro}</p>}
      <div className="mt-10">{children}</div>
    </motion.section>
  );
}

// Transición solo de borde y sombra: un transition-all de CSS también suavizaría el transform que escribe Motion y lo retrasaría.
/** Superficie común de tarjetas: vidrio oscuro con borde que se ilumina en magenta al pasar el cursor. */
export const cardSurface =
  "rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.12)]";
