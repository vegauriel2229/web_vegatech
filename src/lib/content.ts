// src/lib/content.ts
// Cada dato vive en un solo lugar: si un texto aparece en pantalla dos veces, se define acá una sola vez.
import type { ScheduleSlot } from "./schedule";
import { buildWhatsAppUrl } from "./whatsapp";

export const WHATSAPP_NUMBER = "5492617759046";
export const WHATSAPP_URL = buildWhatsAppUrl(WHATSAPP_NUMBER, "Hola Vegatech, quiero consultar por la reparación de mi celular.");
export const INSTAGRAM_URL = "https://instagram.com/vegatech.reparaciones";
export const INSTAGRAM_HANDLE = "@vegatech.reparaciones";
export const PHONE_DISPLAY = "261 775-9046";
export const HERO_IMAGE_URL = "/hero-phone-bg.jpg";
// Misma URL que el favicon: el navegador la reutiliza de caché.
export const LOGO_URL = "/assets/logo-256.png";

export const BUSINESS_TIME_ZONE = "America/Argentina/Mendoza";
export const SCHEDULE: readonly ScheduleSlot[] = [
  { label: "Lun - Vie", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], openHour: 9, closeHour: 19 },
  { label: "Sáb - Dom", days: ["Sat", "Sun"], openHour: 10, closeHour: 14 },
];

export type IconName =
  | "screen" | "battery" | "plug" | "cpu" | "wrench"
  | "chat" | "quote" | "calendar" | "check"
  | "phone" | "pin" | "at"
  | "scan" | "devices" | "home";

export interface TitledItem { icon: IconName; title: string; text: string }
export interface FaqItem { question: string; answer: string }

export interface MarqueeItem { label: string; icon: IconName }
export interface NavLink { href: string; label: string; icon: IconName }

// Compartido por Sidebar (md+) y MobileNav (< md).
export const NAV_LINKS: readonly NavLink[] = [
  { href: "#inicio", label: "Inicio", icon: "home" },
  { href: "#servicios", label: "Servicios", icon: "wrench" },
  { href: "#ubicacion", label: "Ubicación", icon: "pin" },
];

// Mismos íconos que la sección Servicios para el mismo concepto (pantalla, batería, software, carga).
export const MARQUEE_SERVICES: readonly MarqueeItem[] = [
  { label: "Reparación de Pantallas", icon: "screen" },
  { label: "Cambio de Baterías", icon: "battery" },
  { label: "Flasheo de Software", icon: "cpu" },
  { label: "Diagnóstico de Hardware", icon: "scan" },
  { label: "Módulos de Carga", icon: "plug" },
  { label: "Servicio Android/iPhone", icon: "devices" },
];

export const SERVICES_INTRO =
  "Si tu equipo tiene un problema que no ves acá, escribinos igual: lo revisamos y te decimos si tiene arreglo.";

export const SERVICES: readonly TitledItem[] = [
  { icon: "screen", title: "Pantalla rota o con fallas", text: "Cambio de pantalla y táctil." },
  { icon: "battery", title: "Batería que no dura", text: "Si dura poco, se calienta o se apaga sola." },
  { icon: "plug", title: "No carga", text: "Puerto de carga: cuando hay que mover el cable para que cargue." },
  { icon: "cpu", title: "Lento o no enciende bien", text: "Software: equipos que se traban o fallan al iniciar." },
  { icon: "wrench", title: "Cámara, altavoz, botones", text: "Micrófono y otras fallas. Consultanos." },
];

export const STEPS: readonly TitledItem[] = [
  { icon: "chat", title: "Contanos qué le pasa", text: "Escribinos por WhatsApp con el modelo y una descripción del problema. Si podés, mandá una foto." },
  { icon: "quote", title: "Recibí tu presupuesto", text: "Te lo pasamos sin cargo, antes de empezar." },
  { icon: "calendar", title: "Coordinamos la entrega", text: "Acordamos por el mismo chat cómo y cuándo dejar el equipo." },
  { icon: "check", title: "Reparamos y te avisamos", text: "Te mantenemos al tanto hasta que tu equipo esté listo." },
];

// Una etapa por tramo de la animación de ScreenRepair: si cambia la cantidad, ajustar STEP_STARTS allá.
export const REPAIR_STEPS: readonly TitledItem[] = [
  { icon: "scan", title: "¿Se te rompió la pantalla?", text: "Vidrio astillado, manchas, líneas de colores o táctil que no responde." },
  { icon: "wrench", title: "Abrimos el equipo", text: "Lo desarmamos con cuidado para llegar a la pantalla dañada." },
  { icon: "screen", title: "Colocamos la pantalla nueva", text: "Cambiamos la pantalla y el táctil dañados." },
  { icon: "check", title: "Como nuevo", text: "Te avisamos por WhatsApp apenas está listo." },
];

export const ABOUT_PARAGRAPHS: readonly string[] = [
  "Vegatech es un servicio técnico de celulares de Godoy Cruz, Mendoza. Estamos en etapa de crecimiento y trabajamos con un compromiso claro: un servicio serio, transparente y de confianza.",
  "La atención está a cargo de Uriel Vega, responsable de Vegatech, para que cada consulta tenga un trato directo y personalizado.",
];

export const ABOUT_POINTS: readonly string[] = [
  "Atención personalizada, sin intermediarios",
  "Explicaciones claras, sin tecnicismos innecesarios",
];

export const FAQ: readonly FaqItem[] = [
  { question: "¿Cuánto cuesta la reparación?", answer: "Depende del equipo y de los repuestos disponibles en ese momento. Te pasamos el valor exacto en el presupuesto." },
  { question: "¿Cuánto tarda?", answer: "Muchas reparaciones se resuelven en el día. El tiempo exacto depende de si tenemos el repuesto disponible; te lo confirmamos junto con el presupuesto." },
  { question: "¿Qué garantía tiene?", answer: "Consultanos por la garantía de tu reparación y te contamos." },
  { question: "¿Reparan mi marca de celular?", answer: "Sí, trabajamos con todas las marcas y modelos, Android y iPhone. Escribinos con el modelo y lo revisamos." },
];

export const REVIEWS_NOTICE =
  "Estamos empezando y queremos que cada opinión sea real. Cuando tengamos las primeras reseñas de nuestros clientes, las vas a ver acá.";

export type StarRating = 1 | 2 | 3 | 4 | 5;
export interface Testimonial { author: string; text: string; rating: StarRating }

// Solo reseñas reales de clientes que aceptaron publicarlas: inventarlas es publicidad engañosa. Vacío → REVIEWS_NOTICE.
export const TESTIMONIALS: readonly Testimonial[] = [];
// PLACEHOLDER: reemplazar por el link de reseñas del Perfil de Empresa de Google. Hasta entonces el botón lleva a un 404.
export const GOOGLE_REVIEW_URL = "https://g.page/r/TU_ENLACE_DE_RESEÑAS";

export const WORKSHOP_AREA = "Godoy Cruz, Mendoza";
export const WORKSHOP_NOTE = "Sin local abierto al público: coordinamos antes por WhatsApp.";
// Embed clásico (output=embed): no requiere API key. Centrado en la zona, no en una dirección, porque no hay local a la calle.
export const WORKSHOP_MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(WORKSHOP_AREA)}&z=13&output=embed`;
// Formato oficial de Maps URLs: abre la app de Google Maps en móvil y la web en escritorio.
export const WORKSHOP_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(WORKSHOP_AREA)}`;

export const CONTACT_INTRO = "Contanos qué le pasa a tu equipo y te pasamos un presupuesto sin cargo.";

export interface ContactInfoItem { icon: IconName; label: string; lines: readonly string[]; href?: string }

export const CONTACT_INFO: readonly ContactInfoItem[] = [
  { icon: "phone", label: "WhatsApp", lines: [`${PHONE_DISPLAY} (Uriel Vega)`], href: WHATSAPP_URL },
  { icon: "at", label: "Instagram", lines: [INSTAGRAM_HANDLE], href: INSTAGRAM_URL },
];
