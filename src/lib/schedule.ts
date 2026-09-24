// src/lib/schedule.ts
export type Weekday = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface ScheduleSlot {
  label: string;
  days: readonly Weekday[];
  openHour: number;
  /** Exclusivo: con 19 se atiende hasta las 18:59. */
  closeHour: number;
}

export function formatSlot({ label, openHour, closeHour }: ScheduleSlot): string {
  return `${label} | ${openHour}:00 a ${closeHour}:00`;
}

/** Evalúa el horario en la zona del negocio, no en la del visitante. */
export function isOpenAt(date: Date, schedule: readonly ScheduleSlot[], timeZone: string): boolean {
  const weekday = date.toLocaleString("en-US", { timeZone, weekday: "short" });
  const hour = Number(date.toLocaleString("en-US", { timeZone, hour: "numeric", hourCycle: "h23" }));
  return schedule.some(
    (slot) => slot.days.some((day) => day === weekday) && hour >= slot.openHour && hour < slot.closeHour,
  );
}
