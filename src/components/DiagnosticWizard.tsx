// src/components/DiagnosticWizard.tsx
import {
  useId, useLayoutEffect, useRef, useState,
  type FormEvent, type MouseEvent, type ReactNode, type SyntheticEvent,
} from "react";
import { AnimatePresence, motion, type Transition, type Variants } from "framer-motion";
import {
  ArrowLeft, BatteryWarning, Bug, CircleHelp, Cpu, MessageCircle, MonitorX, Pencil, PowerOff, Smartphone, X,
} from "lucide-react";
import { cn } from "../lib/cn";
import { WHATSAPP_NUMBER } from "../lib/content";
import { buildQuoteMessage, buildWhatsAppUrl } from "../lib/whatsapp";
import { BrandLogo } from "./BrandLogo";

interface ChoiceOption { label: string; icon: ReactNode }

const PROBLEM_ICON_PROPS = { size: 34, strokeWidth: 1.5 } as const;

const BRAND_OPTIONS: readonly ChoiceOption[] = [
  { label: "Apple", icon: <BrandLogo brand="Apple" /> },
  { label: "Samsung", icon: <BrandLogo brand="Samsung" /> },
  { label: "Motorola", icon: <BrandLogo brand="Motorola" /> },
  { label: "Xiaomi", icon: <BrandLogo brand="Xiaomi" /> },
];
const OTHER_BRAND: ChoiceOption = { label: "Otra marca", icon: <Smartphone size={20} /> };

const PROBLEM_OPTIONS: readonly ChoiceOption[] = [
  { label: "Pantalla Rota", icon: <MonitorX {...PROBLEM_ICON_PROPS} /> },
  { label: "No Carga/Batería", icon: <BatteryWarning {...PROBLEM_ICON_PROPS} /> },
  { label: "No Enciende", icon: <PowerOff {...PROBLEM_ICON_PROPS} /> },
  { label: "Problema de Software", icon: <Bug {...PROBLEM_ICON_PROPS} /> },
];
const OTHER_PROBLEM: ChoiceOption = { label: "Otro problema", icon: <CircleHelp size={20} /> };

const STEP_TITLES = ["¿Qué marca es tu equipo?", "¿Qué problema presenta?", "Detalles del modelo"] as const;
const BRAND_STEP = 0;
const PROBLEM_STEP = 1;
const MODEL_STEP = 2;
const MODEL_MAX_LENGTH = 60;

/** direction 1 = avanzar (entra por la derecha, sale por la izquierda); -1 = volver (espejo). */
const STEP_VARIANTS: Variants = {
  enter: (direction: number) => ({ x: `${direction * 100}%`, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: `${direction * -100}%`, opacity: 0 }),
};
const STEP_TRANSITION: Transition = {
  x: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
  opacity: { duration: 0.25 },
};

const CORNER_CLASS =
  "pointer-events-none absolute size-3 border-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-aria-pressed:border-fuchsia-500 group-aria-pressed:opacity-100";

interface DiagnosticWizardProps { isOpen: boolean; onClose: () => void }

export function DiagnosticWizard({ isOpen, onClose }: DiagnosticWizardProps) {
  return <AnimatePresence>{isOpen && <WizardDialog key="diagnostic-wizard" onClose={onClose} />}</AnimatePresence>;
}

function WizardDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // showModal() aporta foco atrapado, fondo inerte y, al cerrar, devolución del foco al disparador.
  // Layout effect: el cleanup debe correr con el <dialog> todavía en el DOM, recién terminada la animación de salida.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  // Escape: se cancela el cierre nativo (sería instantáneo) y se delega a React para animar la salida.
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onClose();
  }

  // Anti-abuso de Chrome: sin activación de usuario reciente, Escape cierra el <dialog> sin emitir 'cancel'.
  // Sin esta sincronización React seguiría "abierto" y el disparador no podría reabrirlo.
  // El guard ignora el 'close' asíncrono del cleanup de StrictMode (para entonces el diálogo ya se reabrió).
  function syncNativeClose() {
    if (!dialogRef.current?.open) onClose();
  }

  function closeOnBackdropPress(event: MouseEvent<HTMLDialogElement>) {
    const overlay = event.currentTarget;
    // clientX < clientWidth: un clic en la barra de scroll del overlay también tiene target === overlay.
    if (event.target === overlay && event.clientX < overlay.clientWidth) onClose();
  }

  return (
    <motion.dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClose={syncNativeClose}
      onMouseDown={closeOnBackdropPress}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none items-center justify-center overflow-y-auto border-0 bg-slate-950/80 p-4 text-slate-200 backdrop-blur-sm open:flex backdrop:bg-transparent"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        // m-auto (no solo items-center): si el panel supera el alto de pantalla, el overlay scrollea desde arriba.
        className="relative m-auto w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-700 bg-slate-900/90 p-8 shadow-[0_0_80px_-20px_rgba(217,70,239,0.3)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(148_163_184/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-500 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <WizardSteps titleId={titleId} onSubmitted={onClose} />
      </motion.div>
    </motion.dialog>
  );
}

function WizardSteps({ titleId, onSubmitted }: { titleId: string; onSubmitted: () => void }) {
  const [[step, direction], setStepState] = useState<[number, number]>([BRAND_STEP, 1]);
  const [brand, setBrand] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const pendingFocus = useRef(false);
  const trimmedModel = model.trim();

  function goToStep(nextStep: number) {
    pendingFocus.current = true;
    setStepState([nextStep, nextStep > step ? 1 : -1]);
  }

  // El botón pulsado desaparece con el paso: sin esto el foco cae al <dialog> y teclado/lector pierden el hilo.
  function focusOnStepMount(node: HTMLElement | null) {
    if (!node || !pendingFocus.current) return;
    pendingFocus.current = false;
    node.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brand || !problem || !trimmedModel) return;
    const message = buildQuoteMessage({ brand: brand === OTHER_BRAND.label ? null : brand, model: trimmedModel, problem });
    window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, message), "_blank", "noopener,noreferrer");
    onSubmitted();
  }

  return (
    <div className="relative">
      <header className="flex flex-wrap items-center justify-between gap-3 pr-10">
        <h2 id={titleId} className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
          <Cpu size={14} aria-hidden="true" />
          Diagnóstico inteligente
        </h2>
        <StepProgress current={step} />
      </header>

      <div className="relative mt-8">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={STEP_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={STEP_TRANSITION}
            className="w-full"
          >
            <h3
              ref={step === MODEL_STEP ? undefined : focusOnStepMount}
              tabIndex={-1}
              className="font-display text-2xl font-medium text-white focus:outline-none"
            >
              {STEP_TITLES[step]}
            </h3>

            {step === BRAND_STEP && (
              <ChoiceGrid
                options={BRAND_OPTIONS}
                other={OTHER_BRAND}
                selected={brand}
                onSelect={(label) => { setBrand(label); goToStep(PROBLEM_STEP); }}
              />
            )}

            {step === PROBLEM_STEP && (
              <>
                <ChoiceGrid
                  options={PROBLEM_OPTIONS}
                  other={OTHER_PROBLEM}
                  selected={problem}
                  onSelect={(label) => { setProblem(label); goToStep(MODEL_STEP); }}
                />
                <BackButton onClick={() => goToStep(BRAND_STEP)} className="mt-6" />
              </>
            )}

            {step === MODEL_STEP && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <SummaryChip label="Marca" value={brand} onEdit={() => goToStep(BRAND_STEP)} />
                  <SummaryChip label="Falla" value={problem} onEdit={() => goToStep(PROBLEM_STEP)} />
                </div>
                <div>
                  <label htmlFor="wizard-model" className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                    Modelo exacto
                  </label>
                  <input
                    id="wizard-model"
                    ref={focusOnStepMount}
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    maxLength={MODEL_MAX_LENGTH}
                    placeholder="Ej: iPhone 11, Samsung A54"
                    autoComplete="off"
                    aria-describedby="wizard-model-hint"
                    className="mt-2 w-full border-b-2 border-slate-600 bg-slate-950 px-4 py-3 font-display text-lg text-white transition-colors placeholder:text-slate-600 focus:border-fuchsia-500 focus:outline-none"
                  />
                  <p id="wizard-model-hint" className="mt-2 text-xs text-slate-500">
                    Lo encontrás en Ajustes › Acerca del teléfono.
                  </p>
                </div>
                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <BackButton onClick={() => goToStep(PROBLEM_STEP)} />
                  <button
                    type="submit"
                    disabled={!trimmedModel}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-fuchsia-600 px-7 py-3.5 font-display font-semibold text-white shadow-[0_0_24px_rgba(217,70,239,0.45)] transition-all duration-300 enabled:hover:scale-[1.03] enabled:hover:bg-fuchsia-500 enabled:hover:shadow-[0_0_36px_-4px_rgba(217,70,239,0.75)] enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Solicitar Presupuesto
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepProgress({ current }: { current: number }) {
  const toCode = (value: number): string => String(value).padStart(2, "0");
  return (
    <div className="flex items-center gap-3">
      <span className="sr-only">Paso {current + 1} de {STEP_TITLES.length}</span>
      <span aria-hidden="true" className="font-mono text-xs text-slate-500">
        <span className="text-fuchsia-400">{toCode(current + 1)}</span>/{toCode(STEP_TITLES.length)}
      </span>
      <div aria-hidden="true" className="flex gap-1">
        {STEP_TITLES.map((title, index) => (
          <span
            key={title}
            className={cn(
              "h-1 w-6 rounded-full transition-all duration-500",
              index <= current ? "bg-fuchsia-500 shadow-[0_0_8px_var(--color-fuchsia-500)]" : "bg-slate-700",
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface ChoiceGridProps {
  options: readonly ChoiceOption[];
  /** Opción de descarte ("Otra…"): fila completa bajo la grilla, así 4 + 1 no deja una tarjeta huérfana. */
  other: ChoiceOption;
  selected: string | null;
  onSelect: (label: string) => void;
}

function ChoiceGrid({ options, other, selected, onSelect }: ChoiceGridProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {options.map((option) => (
        <ChoiceCard key={option.label} option={option} selected={selected === option.label} onSelect={onSelect} />
      ))}
      <ChoiceCard option={other} selected={selected === other.label} onSelect={onSelect} wide />
    </div>
  );
}

interface ChoiceCardProps { option: ChoiceOption; selected: boolean; onSelect: (label: string) => void; wide?: boolean }

function ChoiceCard({ option, selected, onSelect, wide = false }: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(option.label)}
      className={cn(
        "group relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-center text-slate-300 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white active:scale-95",
        "aria-pressed:border-fuchsia-500 aria-pressed:text-white aria-pressed:shadow-[inset_0_0_20px_rgba(217,70,239,0.2)]",
        wide && "col-span-2 aspect-auto flex-row py-4 sm:col-span-4",
      )}
    >
      <span aria-hidden="true" className={cn(CORNER_CLASS, "left-2 top-2 rounded-tl-md border-l-2 border-t-2")} />
      <span aria-hidden="true" className={cn(CORNER_CLASS, "bottom-2 right-2 rounded-br-md border-b-2 border-r-2")} />
      {/* Alto fijo del ícono y etiqueta de 2 líneas: logos de distinta proporción (wordmark de Samsung) y
          etiquetas que parten ("Problema de Software") no desalinean la grilla. */}
      <span aria-hidden="true" className="flex h-9 items-center text-slate-400 transition-colors duration-300 group-hover:text-cyan-300 group-aria-pressed:text-fuchsia-400">
        {option.icon}
      </span>
      <span className={cn("font-display text-sm font-medium leading-5", !wide && "min-h-[2lh]")}>{option.label}</span>
    </button>
  );
}

function SummaryChip({ label, value, onEdit }: { label: string; value: string | null; onEdit: () => void }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      aria-label={`Cambiar ${label.toLowerCase()}: ${value}`}
      className="group rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-3 text-left transition-colors hover:border-cyan-500/50 sm:px-4"
    >
      <span className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:text-cyan-400">
        {label}
        <Pencil size={12} aria-hidden="true" />
      </span>
      <span className="mt-1 block text-sm font-medium leading-snug break-words text-white">{value}</span>
    </button>
  );
}

function BackButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex items-center gap-1.5 self-start text-sm font-medium text-slate-400 transition-colors hover:text-fuchsia-300 sm:self-auto", className)}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Atrás
    </button>
  );
}
