import { dayNames, type Unit } from "../data/units";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Estado "aberto agora" no fuso de Corumbá (America/Campo_Grande).
// Só calcula para unidades com horário confirmado.
export function openStatus(unit: Unit, now: Date): { open: boolean; label: string } | null {
  if (!unit.hoursConfirmed || !unit.week) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Campo_Grande",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayIdx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  for (let offset = 0; offset < 8; offset++) {
    const day = unit.week[(dayIdx + offset) % 7];
    if (!Array.isArray(day)) continue;
    for (const period of day) {
      const [from, to] = period.split("—").map((s) => toMinutes(s.trim()));
      if (offset === 0 && minutes >= from && minutes < to) {
        return { open: true, label: `Aberto agora · até ${period.split("—")[1].trim()}` };
      }
      if (offset > 0 || minutes < from) {
        const when = offset === 0 ? "hoje" : offset === 1 ? "amanhã" : dayNames[(dayIdx + offset) % 7].toLowerCase();
        return { open: false, label: `Fechado agora · abre ${when} às ${period.split("—")[0].trim()}` };
      }
    }
  }
  return null;
}
