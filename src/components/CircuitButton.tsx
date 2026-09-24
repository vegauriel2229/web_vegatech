// src/components/CircuitButton.tsx
import { useId, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

/**
 * Botón con dos pulsos de luz (turquesa → magenta) recorriendo el perímetro.
 * SVG <rect> con pathLength=100 + stroke-dashoffset animado: velocidad constante en todo el borde,
 * cosa que un conic-gradient rotando no logra en un botón ancho (acelera en las esquinas).
 */
export function CircuitButton({ className, children, type = "button", ...buttonProps }: ButtonHTMLAttributes<HTMLButtonElement>) {
  // useId() devuelve caracteres que no son válidos dentro de url(#…).
  const gradientId = `circuit-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <button
      type={type}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 font-display font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] active:scale-95",
        className,
      )}
      {...buttonProps}
    >
      {/* Strokes centrados en el borde: overflow-hidden recorta la mitad externa (queda 1px de pista y 1,5px de pulso siguiendo el radio). */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full drop-shadow-[0_0_3px_var(--color-fuchsia-500)]">
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" className="[stop-color:var(--color-cyan-400)]" />
            <stop offset="100%" className="[stop-color:var(--color-fuchsia-500)]" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" rx="16" fill="none" strokeWidth="2" className="stroke-slate-700/80" />
        <rect
          width="100%"
          height="100%"
          rx="16"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          pathLength={100}
          strokeDasharray="14 36"
          className="motion-safe:animate-circuit"
        />
      </svg>
      <span className="relative flex items-center gap-3">{children}</span>
    </button>
  );
}
