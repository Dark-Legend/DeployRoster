import {
  format,
  getDaysInMonth,
  isWeekend,
  startOfMonth,
  addDays,
} from "date-fns";
import type { RosterEntry } from "../store/rosterStore";

interface GenerateOptions {
  month: number; // 0-indexed
  year: number;
  employees: string[];
  holidayDates: string[]; // ISO strings YYYY-MM-DD
}

export function generateRoster({
  month,
  year,
  employees,
  holidayDates,
}: GenerateOptions): RosterEntry[] {
  const totalDays = getDaysInMonth(new Date(year, month));
  const start = startOfMonth(new Date(year, month));
  const holidaySet = new Set(holidayDates);

  const roster: RosterEntry[] = [];
  let idx = 0;

  for (let d = 0; d < totalDays; d++) {
    const current = addDays(start, d);
    const iso = format(current, "yyyy-MM-dd");

    if (isWeekend(current)) continue;
    if (holidaySet.has(iso)) continue;

    roster.push({
      date: format(current, "MMM d"),
      day: format(current, "EEEE"),
      engineer: employees[idx % employees.length],
      isoDate: iso,
    });
    idx++;
  }

  return roster;
}
