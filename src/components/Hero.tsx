// src/components/Hero.tsx
import { motion } from "motion/react";
import { ArrowRight, Cpu } from "lucide-react";
import { LOGO_URL, WHATSAPP_URL } from "../lib/content";
import { CircuitButton } from "./CircuitButton";
import { QuickStatus } from "./QuickStatus";

interface HeroProps { imageUrl: string; onStartDiagnosis: () => void }

export function Hero({ imageUrl, onStartDiagnosis }: HeroProps) {
  return (
    <section className="px-4 pt-4">
      <div className="relative mx-auto flex min-h-[600px] w-full max-w-[1400px] flex-col overflow-hidden rounded-[48px] border border-slate-800 bg-slate-900 shadow-[0_40px_100px_-20px_rgba(217,70,239,0.15)]">
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -20, 0], scale: [1.05, 1.07, 1.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-70 mix-blend-luminosity" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="z-20 flex flex-1 flex-col items-start px-5 py-12 sm:px-8 md:px-16 md:pt-16"
        >
          <div className="mb-5 flex items-center gap-3">
            <img
              src={LOGO_URL}
              alt=""
              width={48}
              height={48}
              className="size-11 rounded-full drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] md:size-12"
            />
            <span className="font-display text-lg font-bold tracking-widest text-fuchsia-200 text-shadow-neon motion-safe:animate-neon md:text-xl">
              VEGATECH
            </span>
          </div>
          <h1 className="font-display text-[42px] font-medium leading-[1.1] tracking-tight text-balance text-white md:text-[56px]">
            Expertos en tu <br className="hidden md:block" /> dispositivo móvil
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-300 md:text-lg">
            Servicio técnico especializado en hardware y software para smartphones. Diagnóstico preciso, reparaciones rápidas y flasheos para Android y iPhone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block rounded-full bg-fuchsia-600 px-6 py-2.5 font-medium text-white! no-underline shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-[background-color,box-shadow] duration-300 hover:bg-fuchsia-500 hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.6)]"
            >
              Contactar Ahora
            </motion.a>
            <CircuitButton onClick={onStartDiagnosis} aria-haspopup="dialog">
              <Cpu size={20} aria-hidden="true" className="text-cyan-400" />
              Iniciá un Diagnóstico Inteligente
              <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
            </CircuitButton>
          </div>
          <QuickStatus className="mt-12" />
        </motion.div>
      </div>
    </section>
  );
}
