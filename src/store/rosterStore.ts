import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface Employee {
  id: string;
  name: string;
  email?: string;
}

export interface Holiday {
  date: string; // ISO date string YYYY-MM-DD
  label?: string;
}

export interface RosterEntry {
  date: string;
  day: string;
  engineer: string;
  isoDate: string; // YYYY-MM-DD for calendar positioning
}

export interface RosterData {
  id: string;
  month: number;
  year: number;
  employees: Employee[];
  holidays: Holiday[];
  roster: RosterEntry[];
  createdAt: string;
}

interface RosterState {
  employees: Employee[];
  month: number;
  year: number;
  holidays: Holiday[];
  roster: RosterEntry[] | null;
  isGenerating: boolean;

  addEmployee: (name: string, email?: string) => void;
  removeEmployee: (id: string) => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  addHoliday: (date: string, label?: string) => void;
  removeHoliday: (date: string) => void;
  setRoster: (roster: RosterEntry[]) => void;
  setIsGenerating: (v: boolean) => void;
  swapEngineers: (dateA: string, dateB: string) => void;
  clearAll: () => void;

  saveAndGetShareId: () => string;
}

const now = new Date();

export const useRosterStore = create<RosterState>((set, get) => ({
  employees: [],
  month: now.getMonth(), // 0-indexed
  year: now.getFullYear(),
  holidays: [],
  roster: null,
  isGenerating: false,

  addEmployee: (name, email) =>
    set((s) => ({
      employees: [
        ...s.employees,
        { id: uuidv4(), name: name.trim(), email: email?.trim() || undefined },
      ],
    })),

  removeEmployee: (id) =>
    set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),

  setMonth: (month) => set({ month, roster: null }),
  setYear: (year) => set({ year, roster: null }),

  addHoliday: (date, label) =>
    set((s) => ({
      holidays: [...s.holidays.filter((h) => h.date !== date), { date, label }],
    })),

  removeHoliday: (date) =>
    set((s) => ({ holidays: s.holidays.filter((h) => h.date !== date) })),

  setRoster: (roster) => set({ roster }),
  setIsGenerating: (v) => set({ isGenerating: v }),

  swapEngineers: (dateA, dateB) =>
    set((s) => {
      if (!s.roster) return {};
      const roster = [...s.roster];
      const idxA = roster.findIndex((r) => r.isoDate === dateA);
      const idxB = roster.findIndex((r) => r.isoDate === dateB);
      if (idxA === -1 || idxB === -1) return {};
      const temp = roster[idxA].engineer;
      roster[idxA] = { ...roster[idxA], engineer: roster[idxB].engineer };
      roster[idxB] = { ...roster[idxB], engineer: temp };
      return { roster };
    }),

  clearAll: () => set({ employees: [], holidays: [], roster: null }),

  saveAndGetShareId: () => {
    const { month, year, employees, holidays, roster } = get();
    const id = uuidv4().slice(0, 8);
    const data: RosterData = {
      id,
      month,
      year,
      employees,
      holidays,
      roster: roster || [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`roster_${id}`, JSON.stringify(data));
    return id;
  },
}));

export function loadRoster(id: string): RosterData | null {
  const raw = localStorage.getItem(`roster_${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RosterData;
  } catch {
    return null;
  }
}
