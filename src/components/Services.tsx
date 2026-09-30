// src/components/Services.tsx
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, SERVICES_INTRO, WHATSAPP_URL } from "../lib/content";
import { cn } from "../lib/cn";
import { IconBadge } from "./Icon";
import { Section, cardSurface, revealVariants } from "./Section";

export function Services() {
  return (
    <Section id="servicios" title="¿Qué le pasa a tu equipo?" className="pt-0" reveal>
      <ul className="grid gap-4 md:grid-cols-3">
        {SERVICES.map(({ icon, title, text }) => (
          <motion.li key={title} variants={revealVariants} whileHover={{ y: -4 }} className={cn(cardSurface, "p-6")}>
            <IconBadge name={icon} />
            <h3 className="mt-5 font-display text-lg font-medium text-white">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-400">{text}</p>
          </motion.li>
        ))}
        <motion.li variants={revealVariants} whileHover={{ y: -4 }} className="rounded-3xl border border-fuchsia-500/30 bg-linear-to-br from-fuchsia-600/20 via-slate-900/50 to-cyan-500/10 p-6">
          <p className="text-sm text-slate-300">{SERVICES_INTRO}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 no-underline hover:text-cyan-200"
          >
            Consultar por WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </motion.li>
      </ul>
    </Section>
  );
}
