// src/components/Sidebar.tsx
import type { ReactNode } from "react";
import { Home, MapPin, Wrench, type LucideIcon } from "lucide-react";

interface SidebarLink { href: string; label: string; Icon: LucideIcon }

const SIDEBAR_LINKS: readonly SidebarLink[] = [
  { href: "#inicio", label: "Inicio", Icon: Home },
  { href: "#servicios", label: "Servicios", Icon: Wrench },
  { href: "#contacto", label: "Ubicación", Icon: MapPin },
];

interface SidebarProps {
  /** Espacio inferior reservado para futuras acciones (usuario, configuración). */
  bottomSlot?: ReactNode;
}

export function Sidebar({ bottomSlot }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col items-center justify-between border-r border-slate-800/50 bg-slate-950/80 py-8 backdrop-blur-2xl md:w-20">
      <a href="#inicio" aria-label="Vegatech">
        <PixelV />
      </a>

      <nav aria-label="Principal" className="flex flex-col items-center gap-2">
        {SIDEBAR_LINKS.map(({ href, label, Icon }) => (
          <a
            key={href}
            href={href}
            className="flex w-14 flex-col items-center rounded-xl py-2 text-slate-500! no-underline transition-colors duration-300 hover:bg-white/5 hover:text-fuchsia-400! md:w-16"
          >
            <Icon size={22} aria-hidden="true" />
            <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider md:text-[10px]">{label}</span>
          </a>
        ))}
      </nav>

      <div className="flex min-h-11 flex-col items-center gap-4">{bottomSlot}</div>
    </aside>
  );
}

/** "V" del logo en grilla de 10×9 píxeles: banda rosa escalonada con traza de circuito y pads. */
function PixelV() {
  return (
    <svg width={30} height={27} viewBox="0 0 10 9" aria-hidden="true" className="drop-shadow-[0_0_6px_var(--color-fuchsia-500)]">
      <path
        d="M0 0h2v2h1v2h1v2h2V4h1V2h1V0h2v2H9v2H8v2H7v2H6v1H4V8H3V6H2V4H1V2H0z"
        shapeRendering="crispEdges"
        className="fill-fuchsia-400"
      />
      <path d="M1 1V2H2V4H3V6H4V8H6V6H7V4H8V2H9V1" fill="none" strokeWidth={0.3} className="stroke-purple-700" />
      <circle cx={1} cy={1} r={0.45} className="fill-purple-700" />
      <circle cx={9} cy={1} r={0.45} className="fill-purple-700" />
      <circle cx={5} cy={8.4} r={0.45} className="fill-purple-700" />
    </svg>
  );
}
