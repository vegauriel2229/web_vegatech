// src/components/ContactMap.tsx
import { motion, type Variants } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { cn } from "../lib/cn";
import {
  REVIEWS_NOTICE, TESTIMONIALS, WORKSHOP_AREA, WORKSHOP_MAP_EMBED_URL, WORKSHOP_MAPS_URL, WORKSHOP_NOTE,
  type StarRating, type Testimonial,
} from "../lib/content";
import { IconBadge } from "./Icon";
import { Section, cardSurface } from "./Section";

const MAX_RATING = 5;

const TESTIMONIAL_LIST_VARIANTS: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const TESTIMONIAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/** Ubicación del taller + prueba social. */
export function ContactMap() {
  return (
    <Section id="ubicacion" title="Ubicación y opiniones">
      <div className="grid gap-8 md:grid-cols-2">
        <WorkshopLocation />
        <CustomerReviews />
      </div>
    </Section>
  );
}

function WorkshopLocation() {
  return (
    <div className={cn(cardSurface, "flex flex-col p-6")}>
      <h3 className="font-display text-xl font-medium text-white">Nuestro taller en Godoy Cruz</h3>
      <iframe
        src={WORKSHOP_MAP_EMBED_URL}
        title={`Mapa de ${WORKSHOP_AREA}`}
        loading="lazy"
        className="mt-5 h-64 w-full rounded-xl opacity-80 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
      />
      <div className="mt-5 flex items-start gap-3">
        <IconBadge name="pin" className="size-9 rounded-xl" />
        <p>
          <span className="block text-slate-200">{WORKSHOP_AREA}</span>
          <span className="mt-1 block text-sm text-slate-400">{WORKSHOP_NOTE}</span>
        </p>
      </div>
      <a
        href={WORKSHOP_MAPS_URL}
        target="_blank"
        rel="noopener"
        className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-fuchsia-500/60 hover:text-fuchsia-300"
      >
        Ver en Google Maps
        <ExternalLink size={16} aria-hidden="true" />
      </a>
    </div>
  );
}

function CustomerReviews() {
  return (
    <div className={cn(cardSurface, "flex flex-col p-6")}>
      <h3 className="font-display text-xl font-medium text-white">Opiniones de clientes</h3>
      {TESTIMONIALS.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">{REVIEWS_NOTICE}</p>
      ) : (
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={TESTIMONIAL_LIST_VARIANTS}
          className="mt-5 flex flex-col gap-4"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.li key={testimonial.text} variants={TESTIMONIAL_VARIANTS}>
              <TestimonialCard testimonial={testimonial} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

function TestimonialCard({ testimonial: { author, text, rating } }: { testimonial: Testimonial }) {
  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <StarRow rating={rating} />
      <blockquote className="mt-2 text-slate-200">“{text}”</blockquote>
      <figcaption className="mt-2 text-sm font-semibold text-cyan-300">{author}</figcaption>
    </figure>
  );
}

function StarRow({ rating }: { rating: StarRating }) {
  return (
    <div role="img" aria-label={`${rating} de ${MAX_RATING} estrellas`} className="flex gap-0.5">
      {Array.from({ length: MAX_RATING }, (_, index) => (
        <Star
          key={index}
          size={16}
          aria-hidden="true"
          className={index < rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}
        />
      ))}
    </div>
  );
}
