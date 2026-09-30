// src/components/SiteChrome.tsx
import { cn } from "../lib/cn";
import {
  HERO_IMAGE_URL, INSTAGRAM_URL, LOGO_URL, SCHEDULE, WHATSAPP_NUMBER, WHATSAPP_URL, WORKSHOP_AREA,
} from "../lib/content";
import { toSchemaOpeningHours } from "../lib/schedule";

const WHATSAPP_FAB_HINT = "¿Urgencia? Hablanos";

/**
 * Ficha de negocio (schema.org) que Google usa para entender quién es, dónde atiende y en qué horario.
 * Google lee el JSON-LD aunque lo inserte JavaScript; se arma acá para no duplicar los datos de content.ts.
 */
export function LocalBusinessSchema() {
  const { origin } = window.location;
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "VegaTech",
    url: `${origin}/`,
    logo: `${origin}${LOGO_URL}`,
    image: `${origin}${HERO_IMAGE_URL}`,
    telephone: `+${WHATSAPP_NUMBER}`,
    // Sin calle: no hay local abierto al público (ver WORKSHOP_NOTE).
    address: { "@type": "PostalAddress", addressLocality: "Godoy Cruz", addressRegion: "Mendoza", addressCountry: "AR" },
    areaServed: WORKSHOP_AREA,
    sameAs: [INSTAGRAM_URL],
    openingHoursSpecification: toSchemaOpeningHours(SCHEDULE),
  };
  return <script type="application/ld+json">{JSON.stringify(business)}</script>;
}

export function SiteFooter({ className }: { className?: string }) {
  return (
    // pb-24 en móvil: el texto ocupa todo el ancho y el FAB fijo taparía su final al llegar abajo de todo.
    <footer className={cn("border-t border-slate-800 px-4 pb-24 pt-8 text-center text-sm text-slate-500 md:pb-8", className)}>
      © {new Date().getFullYear()} VegaTech. Desarrollo y Mantenimiento Tecnológico. Godoy Cruz, Mendoza.
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener"
      aria-label={`${WHATSAPP_FAB_HINT} por WhatsApp`}
      // z-40, no z-50: con z-50 empataría con el cajón de MobileNav y, por ir después en el DOM, quedaría encima.
      className="group fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-transform hover:scale-105 motion-safe:animate-whatsapp-glow"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 translate-x-1 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-1.5 text-sm font-medium text-slate-100 opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        {WHATSAPP_FAB_HINT}
      </span>
      <WhatsAppGlyph />
    </a>
  );
}

// Path de Simple Icons (CC0, simpleicons.org). La marca pertenece a su titular; acá solo identifica el canal de contacto.
function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
