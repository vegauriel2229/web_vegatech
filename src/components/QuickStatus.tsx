// src/components/QuickStatus.tsx
import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "../lib/cn";
import { BUSINESS_TIME_ZONE, INSTAGRAM_HANDLE, INSTAGRAM_URL, SCHEDULE } from "../lib/content";
import { formatSlot, isOpenAt } from "../lib/schedule";

const MAGNETIC_PULL = 0.3;
const MAGNETIC_SPRING = { stiffness: 300, damping: 18, mass: 0.3 };
const STATUS_REFRESH_MS = 60_000;

const isOpenNow = (): boolean => isOpenAt(new Date(), SCHEDULE, BUSINESS_TIME_ZONE);

/** Re-evalúa cada minuto para que una pestaña abierta no quede mostrando un estado vencido. */
function useIsOpenNow(): boolean {
  const [isOpen, setIsOpen] = useState(isOpenNow);
  useEffect(() => {
    const intervalId = setInterval(() => setIsOpen(isOpenNow()), STATUS_REFRESH_MS);
    return () => clearInterval(intervalId);
  }, []);
  return isOpen;
}

export function QuickStatus({ className }: { className?: string }) {
  const isOpen = useIsOpenNow();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
      // flex-wrap: entre sm y lg el ancho útil del Hero no alcanza para los tres ítems en una fila.
      // p-3 en mobile: con p-4 "Sáb - Dom | 10:00 a 14:00" se parte en pantallas de 360px.
      className={cn(
        "flex flex-col flex-wrap items-start gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-3 text-sm text-slate-300 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:gap-x-8 sm:p-4",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn("size-2 rounded-full", isOpen ? "bg-green-500 motion-safe:animate-pulse" : "bg-slate-500")}
        />
        {isOpen ? "Atendiendo consultas" : "Fuera de horario"}
      </span>
      <span className="flex items-start gap-2">
        <Clock size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-cyan-400" />
        <span className="flex flex-col">
          {SCHEDULE.map((slot) => <span key={slot.label}>{formatSlot(slot)}</span>)}
        </span>
      </span>
      <InstagramLink />
    </motion.div>
  );
}

function InstagramLink() {
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, MAGNETIC_SPRING);
  const y = useSpring(0, MAGNETIC_SPRING);

  function pullTowardPointer(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - left - width / 2) * MAGNETIC_PULL);
    y.set((event.clientY - top - height / 2) * MAGNETIC_PULL);
  }

  function release() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener"
      aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
      style={{ x, y }}
      onPointerMove={pullTowardPointer}
      onPointerLeave={release}
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-fuchsia-500/10 px-3 py-1.5 text-sm font-medium text-fuchsia-400! no-underline transition-colors hover:text-fuchsia-300!"
    >
      <InstagramGlyph />
      Instagram
    </motion.a>
  );
}

// lucide-react v1 eliminó los íconos de marca; trazo copiado del glifo "instagram" original de Lucide (ISC).
function InstagramGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
