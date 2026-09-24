// src/components/MobileNav.tsx
import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../lib/content";
import { ICONS } from "./Icon";
import { PixelV } from "./PixelV";

const DRAWER_TRANSITION: Transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

/** Navegación exclusiva de móvil (< md): top bar fija + cajón lateral. En md+ la reemplaza Sidebar. */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();

  const closeDrawer = () => setIsOpen(false);

  // El cajón no es un <dialog>: showModal() lo subiría a la top layer, por encima de la top bar y su botón X.
  // Por eso Escape y la devolución del foco se resuelven a mano.
  useEffect(() => {
    if (!isOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  // Sin foco atrapado, salir con Tab cierra el cajón para que el foco no quede en contenido tapado por el overlay.
  // relatedTarget null (clic en zona no enfocable, cambio de pestaña) no cuenta como abandono.
  function closeOnFocusLeave(event: FocusEvent<HTMLDivElement>) {
    const nextFocus = event.relatedTarget;
    if (nextFocus instanceof Node && !event.currentTarget.contains(nextFocus)) closeDrawer();
  }

  return (
    <div className="md:hidden" onBlur={closeOnFocusLeave}>
      <header className="fixed inset-x-0 top-0 z-60 flex h-16 items-center justify-between border-b border-slate-800/50 bg-slate-950/80 px-4 backdrop-blur-md">
        <a href="#inicio" onClick={closeDrawer} className="flex items-center gap-2.5">
          <PixelV />
          <span className="bg-linear-to-r from-fuchsia-400 to-cyan-300 bg-clip-text font-display text-sm font-bold tracking-widest text-transparent">
            VEGATECH
          </span>
        </a>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((wasOpen) => !wasOpen)}
          aria-expanded={isOpen}
          aria-controls={isOpen ? drawerId : undefined}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          className="rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-fuchsia-400"
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          // data-mobile-nav-drawer: gancho del bloqueo de scroll en index.css mientras el cajón está montado.
          <div key="mobile-nav-drawer" data-mobile-nav-drawer className="fixed inset-0 z-50">
            <motion.div
              aria-hidden="true"
              onClick={closeDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={DRAWER_TRANSITION}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.nav
              id={drawerId}
              aria-label="Principal"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={DRAWER_TRANSITION}
              className="absolute inset-y-0 right-0 flex w-64 flex-col gap-6 border-l border-slate-700/50 bg-slate-900 p-6 pt-20 shadow-2xl"
            >
              {NAV_LINKS.map(({ href, label, icon }) => {
                const Glyph = ICONS[icon];
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={closeDrawer}
                    className="flex items-center gap-4 rounded-xl p-3 text-lg text-slate-300 transition-colors hover:bg-white/5 hover:text-fuchsia-400"
                  >
                    <Glyph size={22} aria-hidden="true" />
                    {label}
                  </a>
                );
              })}
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
