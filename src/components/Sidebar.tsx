// src/components/Sidebar.tsx
import type { ReactNode } from "react";
import { NAV_LINKS } from "../lib/content";
import { ICONS } from "./Icon";
import { PixelV } from "./PixelV";

interface SidebarProps {
  /** Espacio inferior reservado para futuras acciones (usuario, configuración). */
  bottomSlot?: ReactNode;
}

/** Navegación de escritorio (md+). Por debajo de md la reemplaza MobileNav. */
export function Sidebar({ bottomSlot }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-20 flex-col items-center justify-between border-r border-slate-800/50 bg-slate-950/80 py-8 backdrop-blur-2xl md:flex">
      <a href="#inicio" aria-label="Vegatech">
        <PixelV />
      </a>

      <nav aria-label="Principal" className="flex flex-col items-center gap-2">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const Glyph = ICONS[icon];
          return (
            <a
              key={href}
              href={href}
              className="flex w-16 flex-col items-center rounded-xl py-2 text-slate-500! no-underline transition-colors duration-300 hover:bg-white/5 hover:text-fuchsia-400!"
            >
              <Glyph size={22} aria-hidden="true" />
              <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider">{label}</span>
            </a>
          );
        })}
      </nav>

      <div className="flex min-h-11 flex-col items-center gap-4">{bottomSlot}</div>
    </aside>
  );
}
