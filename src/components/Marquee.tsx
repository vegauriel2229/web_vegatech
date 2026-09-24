// src/components/Marquee.tsx
import type { MarqueeItem } from "../lib/content";
import { ICONS } from "./Icon";

interface MarqueeProps { items: readonly MarqueeItem[] }

/** La lista se duplica: animar de 0 a -50% (ver --animate-marquee en index.css) da un bucle sin saltos. */
export function Marquee({ items }: MarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div
      role="list"
      aria-label="Servicios"
      className="mb-20 mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {loop.map(({ label, icon }, i) => {
          const Glyph = ICONS[icon];
          return (
            <div
              key={`${label}-${i}`}
              role="listitem"
              aria-hidden={i >= items.length}
              className="group relative mx-3 flex h-20 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-slate-800 bg-slate-900/50 px-8 shadow-sm backdrop-blur-sm transition-all hover:border-fuchsia-500/50 hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]"
            >
              <Glyph size={16} aria-hidden="true" className="shrink-0 text-cyan-400 transition-colors group-hover:text-fuchsia-400" />
              <span className="text-sm font-semibold text-[#e2e8f0] transition-colors group-hover:text-cyan-300">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
