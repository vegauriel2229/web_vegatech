// src/components/Process.tsx
import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { STEPS } from "../lib/content";
import { IconBadge } from "./Icon";
import { Section } from "./Section";

// La línea tarda lo mismo que el escalonado: cada paso aparece justo cuando la luz llega a su ícono.
const STEP_REVEAL_INTERVAL_S = 0.4;
const LINE_FILL_DURATION_S = STEP_REVEAL_INTERVAL_S * (STEPS.length - 1);

const TIMELINE_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STEP_REVEAL_INTERVAL_S } },
};

// Sin delay propio (lo pone el padre): framer reaplica la transición del variant al terminar el hover,
// y con delay el paso quedaría "levantado" hasta 1,2 s después de sacar el mouse.
const STEP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Del centro del 1er ícono (22px) al del 4º: 3 columnas + 3 gaps de 24px = 75% del ancho + 18px.
const LINE_CLASS = "absolute left-[22px] top-[21px] hidden h-0.5 w-[calc(75%+18px)] md:block";

export function Process() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const isInView = useInView(timelineRef, { once: true, amount: 0.25 });

  return (
    <Section id="como-funciona" title="Cómo trabajamos" intro="Todo se coordina por WhatsApp, de forma simple y sin vueltas.">
      <motion.ol
        ref={timelineRef}
        variants={TIMELINE_VARIANTS}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative grid gap-8 md:grid-cols-4 md:gap-6"
      >
        <span aria-hidden="true" className={`${LINE_CLASS} rounded-full bg-slate-800`} />
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isInView ? 1 : 0 }}
          transition={{ duration: LINE_FILL_DURATION_S, ease: "linear" }}
          className={`${LINE_CLASS} origin-left rounded-full bg-linear-to-r from-fuchsia-500 to-cyan-500 shadow-[0_0_12px_rgba(217,70,239,0.6)]`}
        />
        {STEPS.map(({ icon, title, text }, i) => (
          <motion.li
            key={title}
            variants={STEP_VARIANTS}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex gap-4 md:flex-col md:gap-5"
          >
            <IconBadge
              name={icon}
              className="relative bg-slate-950 transition-[border-color,box-shadow] duration-300 group-hover:border-fuchsia-500 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.5)]"
            />
            <div>
              <h3 className="font-display text-lg font-medium text-white">
                <span className="mr-2 text-fuchsia-400">{i + 1}.</span>
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-400">{text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  );
}
