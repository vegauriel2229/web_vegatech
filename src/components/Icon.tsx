// src/components/Icon.tsx
import {
  AtSign, BatteryCharging, CalendarCheck, Check, Cpu, FileText, Home,
  MapPin, MessageCircle, Phone, PlugZap, ScanSearch, Smartphone, TabletSmartphone, Wrench, type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/cn";
import type { IconName } from "../lib/content";

export const ICONS: Record<IconName, LucideIcon> = {
  screen: Smartphone, battery: BatteryCharging, plug: PlugZap, cpu: Cpu, wrench: Wrench,
  chat: MessageCircle, quote: FileText, calendar: CalendarCheck, check: Check,
  phone: Phone, pin: MapPin, at: AtSign,
  scan: ScanSearch, devices: TabletSmartphone, home: Home,
};

interface IconBadgeProps { name: IconName; className?: string }

/** Ícono sobre cuadrado con degradado magenta/turquesa: único acento gráfico repetido en todas las secciones. */
export function IconBadge({ name, className }: IconBadgeProps) {
  const Glyph = ICONS[name];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-500/25 bg-linear-to-br from-fuchsia-500/20 to-cyan-400/10 text-cyan-300",
        className,
      )}
    >
      <Glyph size={20} />
    </span>
  );
}
