// scripts/check-schedule.ts — `npm test` (Node ≥ 23.6 ejecuta TypeScript sin compilar)
import assert from "node:assert/strict";
import { isOpenAt, type ScheduleSlot } from "../src/lib/schedule.ts";

const schedule: readonly ScheduleSlot[] = [
  { label: "Lun - Vie", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], openHour: 9, closeHour: 19 },
  { label: "Sáb - Dom", days: ["Sat", "Sun"], openHour: 10, closeHour: 14 },
];
const isOpenAtUtc = (iso: string): boolean => isOpenAt(new Date(iso), schedule, "America/Argentina/Mendoza");

// Mendoza = UTC-3. 2026-09-21 es lunes, 2026-09-26 sábado.
assert.equal(isOpenAtUtc("2026-09-21T11:59:00Z"), false, "lun 08:59");
assert.equal(isOpenAtUtc("2026-09-21T12:00:00Z"), true, "lun 09:00");
assert.equal(isOpenAtUtc("2026-09-21T21:59:00Z"), true, "lun 18:59");
assert.equal(isOpenAtUtc("2026-09-21T22:00:00Z"), false, "lun 19:00");
assert.equal(isOpenAtUtc("2026-09-22T02:00:00Z"), false, "lun 23:00 (ya martes en UTC)");
assert.equal(isOpenAtUtc("2026-09-26T13:00:00Z"), true, "sáb 10:00");
assert.equal(isOpenAtUtc("2026-09-26T17:00:00Z"), false, "sáb 14:00");
console.log("schedule: ok");
