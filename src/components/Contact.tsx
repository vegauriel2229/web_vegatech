// src/components/Contact.tsx
import { motion } from "framer-motion";
import { CONTACT_INFO, CONTACT_INTRO, REVIEWS_NOTICE, WHATSAPP_URL } from "../lib/content";
import { cn } from "../lib/cn";
import { IconBadge } from "./Icon";
import { Section, cardSurface } from "./Section";

export function Contact() {
  return (
    <Section id="contacto" title="Contacto" intro={CONTACT_INTRO}>
      <div className="grid gap-4 md:grid-cols-2">
        <dl className="grid gap-4 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
          {CONTACT_INFO.map(({ icon, label, lines, href }) => (
            <div key={label} className={cn(cardSurface, "p-5")}>
              <IconBadge name={icon} className="size-9 rounded-xl" />
              <dt className="mt-4 text-sm font-semibold text-cyan-300">{label}</dt>
              {lines.map((line, i) => (
                <dd key={line} className={i === 0 ? "mt-1 text-slate-200" : "mt-1 text-sm text-slate-400"}>
                  {i === 0 && href ? (
                    <a href={href} target="_blank" rel="noopener" className="text-slate-200! no-underline hover:text-fuchsia-300!">{line}</a>
                  ) : line}
                </dd>
              ))}
            </div>
          ))}
        </dl>

        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center rounded-3xl bg-fuchsia-600 px-8 py-6 text-lg font-semibold text-white! no-underline shadow-[0_0_30px_rgba(217,70,239,0.35)] transition-colors hover:bg-fuchsia-500"
        >
          Escribinos por WhatsApp
        </motion.a>
        <p className="rounded-3xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">{REVIEWS_NOTICE}</p>
      </div>
    </Section>
  );
}
