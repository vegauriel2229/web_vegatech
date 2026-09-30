// src/components/ScreenRepair.tsx
import { useRef, useState } from "react";
import {
  motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue,
} from "motion/react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { LOGO_URL, REPAIR_STEPS } from "../lib/content";
import { IconBadge } from "./Icon";

// Progreso del scroll (0 → 1) en el que arranca cada etapa de REPAIR_STEPS. Los tramos del teléfono se alinean a estos.
const STEP_STARTS = [0, 0.18, 0.42, 0.8] as const;
// Tilt + despiece: [empieza a abrirse, abierto, empieza a cerrarse, cerrado].
const OPEN_RANGE = [0.1, 0.3, 0.66, 0.82];
const MAX_LAYER_GAP_PX = 90;
const SWAP_LIFT_PX = 160;

// Mismo radio en px en ambos ejes: el alto del teléfono es 19/9 del ancho.
const LAYER = "absolute inset-0 rounded-[14%/6.6%]";
const SCREEN = cn(LAYER, "@container overflow-hidden border-[5px] border-black bg-black ring-1 ring-slate-600 will-change-transform");

function stepAt(progress: number): number {
  let step = 0;
  for (let i = 1; i < STEP_STARTS.length; i++) if (progress >= STEP_STARTS[i]) step = i;
  return step;
}

export function ScreenRepair() {
  const reduceMotion = useReducedMotion() ?? false;
  return reduceMotion ? <StaticScreenRepair /> : <ScrollScreenRepair />;
}

function ScrollScreenRepair() {
  const trackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Suaviza los saltos de la rueda del mouse sin despegarse del scroll.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [activeStep, setActiveStep] = useState(0);
  useMotionValueEvent(progress, "change", (latest) => setActiveStep(stepAt(latest)));

  return (
    <section id="reparacion" ref={trackRef} aria-labelledby="reparacion-titulo" className="relative h-[320vh]">
      {/* pt-16: bajo md la top bar fija de MobileNav taparía el título. */}
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16 md:pt-0">
        <RepairLayout progress={progress} activeStep={activeStep} />
      </div>
    </section>
  );
}

/** Movimiento reducido: sin pinning ni scroll-linking, se muestra el teléfono reparado y todas las etapas. */
function StaticScreenRepair() {
  const repaired = useMotionValue(1);
  return (
    <section id="reparacion" aria-labelledby="reparacion-titulo" className="py-20">
      <RepairLayout progress={repaired} activeStep={null} />
    </section>
  );
}

interface RepairLayoutProps { progress: MotionValue<number>; activeStep: number | null }

function RepairLayout({ progress, activeStep }: RepairLayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1100px] items-center gap-x-10 gap-y-6 px-4 md:grid-cols-2 md:grid-rows-2">
      <h2 id="reparacion-titulo" className="font-display text-3xl font-medium tracking-tight text-white md:self-end md:text-4xl">
        Así cambiamos tu pantalla
      </h2>
      <div className="flex justify-center md:col-start-2 md:row-span-2 md:row-start-1">
        <RepairPhone progress={progress} />
      </div>
      <ol className="space-y-6 md:self-start">
        {REPAIR_STEPS.map(({ icon, title, text }, i) => {
          const isCurrent = activeStep === i;
          const isVisible = activeStep === null || isCurrent;
          return (
            // Bajo md solo se ve la etapa actual; las demás quedan sr-only para que el lector de pantalla lea la lista completa.
            <li key={title} className={cn("flex gap-4 transition-opacity duration-500", !isVisible && "max-md:sr-only md:opacity-35")}>
              <IconBadge
                name={icon}
                className={cn("transition-[border-color,box-shadow] duration-500", isCurrent && "border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.5)]")}
              />
              <div>
                <h3 className="font-display text-lg font-medium text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function RepairPhone({ progress }: { progress: MotionValue<number> }) {
  const tiltX = useTransform(progress, OPEN_RANGE, [0, 58, 58, 0]);
  const spinZ = useTransform(progress, OPEN_RANGE, [0, -32, -32, 0]);
  const scale = useTransform(progress, OPEN_RANGE, [1, 0.82, 0.82, 1]);
  const layerGap = useTransform(progress, OPEN_RANGE, [0, MAX_LAYER_GAP_PX, MAX_LAYER_GAP_PX, 0]);

  // Base de -2px: en reposo las capas no pueden ser coplanares o el navegador las dibuja en cualquier orden.
  const backZ = useTransform(() => -2 - layerGap.get());

  const brokenLift = useTransform(progress, [0.34, 0.48], [0, SWAP_LIFT_PX]);
  const brokenZ = useTransform(() => layerGap.get() + brokenLift.get());
  const brokenX = useTransform(progress, [0.34, 0.48], ["0%", "-35%"]);
  const brokenOpacity = useTransform(progress, [0.4, 0.48], [1, 0]);

  const newLift = useTransform(progress, [0.48, 0.62], [SWAP_LIFT_PX, 0]);
  const newZ = useTransform(() => layerGap.get() + newLift.get());
  const newX = useTransform(progress, [0.48, 0.62], ["35%", "0%"]);
  const newOpacity = useTransform(progress, [0.48, 0.54], [0, 1]);

  const screenOff = useTransform(progress, [0.84, 0.94], [1, 0]);
  const glow = useTransform(progress, [0.84, 0.94], [0, 1]);

  return (
    <div aria-hidden="true" className="pointer-events-none relative perspective-[1600px]">
      <motion.div
        className="absolute -inset-10 rounded-full bg-linear-to-br from-fuchsia-500/45 to-cyan-400/35 blur-3xl"
        style={{ opacity: glow }}
      />
      <motion.div
        className="relative aspect-[9/19] h-[min(52svh,560px)] transform-3d will-change-transform md:h-[min(72svh,560px)]"
        style={{ rotateX: tiltX, rotateZ: spinZ, scale }}
      >
        <motion.div className={cn(LAYER, "bg-linear-to-br from-slate-700 to-slate-900 ring-1 ring-slate-500/60 will-change-transform")} style={{ z: backZ }}>
          <span className="absolute left-[27%] top-[36%] aspect-square w-[46%] rounded-full border-8 border-double border-amber-500/40" />
        </motion.div>

        <div className={cn(LAYER, "border-2 border-slate-500/70")} style={{ transform: "translateZ(-1px)" }}>
          <span className="absolute inset-x-[8%] top-[4%] h-[28%] rounded-2xl border border-cyan-400/30 bg-slate-900/90 bg-[linear-gradient(90deg,rgba(34,211,238,0.14)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.14)_1px,transparent_1px)] bg-size-[10px_10px]" />
          <span className="absolute left-[16%] top-[8%] aspect-square w-[18%] rounded-full bg-slate-800 ring-4 ring-slate-600" />
          <span className="absolute left-[16%] top-[19%] aspect-square w-[12%] rounded-full bg-slate-800 ring-4 ring-slate-600" />
          <span className="absolute right-[18%] top-[12%] aspect-square w-[22%] rounded-md bg-fuchsia-500/30 ring-1 ring-fuchsia-400/60" />
          <span className="absolute inset-x-[10%] bottom-[6%] top-[36%] flex items-center justify-center rounded-2xl border border-slate-600 bg-linear-to-b from-slate-800 to-slate-900">
            <span className="text-xs font-semibold tracking-widest text-slate-500">Li-ion</span>
          </span>
        </div>

        <motion.div className={SCREEN} style={{ z: brokenZ, x: brokenX, opacity: brokenOpacity }}>
          <BrokenScreen />
        </motion.div>

        <motion.div className={SCREEN} style={{ z: newZ, x: newX, opacity: newOpacity }}>
          <NewScreen off={screenOff} />
        </motion.div>
      </motion.div>
    </div>
  );
}

const WALLPAPER =
  "absolute inset-0 bg-slate-950 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(217,70,239,0.55),transparent_60%),radial-gradient(100%_70%_at_90%_90%,rgba(34,211,238,0.45),transparent_60%)]";

function ScreenGlass() {
  return (
    <>
      <span className="absolute left-1/2 top-[2.2%] h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      <span className="absolute inset-0 bg-linear-to-br from-white/12 via-transparent to-transparent" />
    </>
  );
}

function BrokenScreen() {
  return (
    <>
      <span className={cn(WALLPAPER, "opacity-35 grayscale")} />
      {/* Mancha de LCD alrededor del impacto (68%, 66%): mismo punto que CRACK_IMPACT. */}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_68%_66%,#000_0,#000_14%,transparent_34%)]" />
      <span className="absolute inset-y-0 left-[30%] w-0.5 bg-fuchsia-500/80 motion-safe:animate-pulse" />
      <span className="absolute inset-y-0 left-[47%] w-px bg-emerald-400/70" />
      <span className="absolute inset-x-0 top-[24%] h-[3%] bg-cyan-300/15" />
      <CrackLines />
      <ScreenGlass />
    </>
  );
}

function NewScreen({ off }: { off: MotionValue<number> }) {
  return (
    <>
      <span className={WALLPAPER} />
      <span className="absolute left-[10%] top-[2.4%] text-[6cqw] font-semibold text-white">9:41</span>
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-[4cqw]">
        <img src={LOGO_URL} alt="" className="size-[34cqw] rounded-full drop-shadow-[0_0_14px_rgba(217,70,239,0.6)]" />
        <span className="font-display text-[9cqw] font-bold tracking-widest text-fuchsia-100 text-shadow-neon">VEGATECH</span>
        <span className="flex items-center gap-[1.5cqw] rounded-full bg-emerald-500/20 px-[5cqw] py-[1.5cqw] text-[5.5cqw] font-medium text-emerald-300 ring-1 ring-emerald-400/40">
          <Check className="size-[5.5cqw]" />
          Pantalla nueva
        </span>
      </span>
      <span className="absolute bottom-[1.6%] left-1/2 h-[0.8%] w-[36%] -translate-x-1/2 rounded-full bg-white/70" />
      <motion.span className="absolute inset-0 bg-black" style={{ opacity: off }} />
      <ScreenGlass />
    </>
  );
}

// viewBox con la proporción del teléfono (9:19). Grietas radiales desde el impacto en (68, 140).
const CRACK_IMPACT = "M60 128 L72 126 L78 134 L77 146 L70 152 L60 149 L57 138 Z";
const CRACK_PATH = [
  CRACK_IMPACT,
  "M68 140 L60 122 L63 104 L52 80 L55 58 L44 30 L47 0",
  "M55 58 L66 50 L72 36",
  "M52 80 L38 86 L28 80",
  "M68 140 L82 128 L90 112 L100 106",
  "M68 140 L78 150 L86 170 L100 178",
  "M86 170 L80 190",
  "M68 140 L66 160 L72 182 L68 211",
  "M68 140 L50 148 L34 144 L18 156 L0 152",
  "M34 144 L30 130",
  "M68 140 L56 132 L40 118 L26 120 L10 104 L0 106",
  "M52 118 L66 112 L84 120 L90 138",
  "M84 158 L68 166 L50 160",
].join(" ");

function CrackLines() {
  return (
    <svg viewBox="0 0 100 211" preserveAspectRatio="none" className="absolute inset-0 size-full">
      <path d={CRACK_IMPACT} fill="white" fillOpacity={0.14} />
      <path d={CRACK_PATH} fill="none" stroke="white" strokeOpacity={0.14} strokeWidth={4} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={CRACK_PATH} fill="none" stroke="white" strokeOpacity={0.85} strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
