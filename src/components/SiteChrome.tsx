// src/components/SiteChrome.tsx
import { MessageCircle } from "lucide-react";
import { cn } from "../lib/cn";
import { WHATSAPP_URL } from "../lib/content";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-slate-800 px-4 py-8 text-center text-sm text-slate-500", className)}>
      © {new Date().getFullYear()} Vegatech. Todos los derechos reservados.
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-4 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-fuchsia-600 text-white! shadow-[0_0_24px_rgba(217,70,239,0.45)] transition-transform hover:scale-105"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}
