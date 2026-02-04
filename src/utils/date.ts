import { DateTime } from "luxon";

export function nowInZone(zone: string) {
  return DateTime.now().setZone(zone);
}

export function toDateKey(input: Date | string | DateTime | undefined, zone: string) {
  if (!input) return nowInZone(zone).toISODate();
  const dt =
    input instanceof DateTime
      ? input
      : typeof input === "string"
        ? DateTime.fromISO(input, { zone })
        : DateTime.fromJSDate(input, { zone });
  if (!dt.isValid) return nowInZone(zone).toISODate();
  return dt.setZone(zone).toISODate();
}

export function parseDate(input: string | undefined, zone: string) {
  if (!input) return null;
  let dt = DateTime.fromISO(input, { zone });
  if (!dt.isValid) {
    dt = DateTime.fromRFC2822(input, { zone });
  }
  if (!dt.isValid) {
    dt = DateTime.fromSQL(input, { zone });
  }
  return dt.isValid ? dt : null;
}

export function withinLookback(dt: DateTime | null, lookbackDays: number, zone: string) {
  if (!dt) return true;
  const now = nowInZone(zone);
  const diff = now.diff(dt.setZone(zone), "days").days;
  return diff <= lookbackDays + 0.5;
}

export function diffDays(a: DateTime, b: DateTime) {
  return Math.abs(a.diff(b, "days").days);
}
