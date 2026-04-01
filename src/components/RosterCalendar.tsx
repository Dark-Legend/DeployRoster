import { useState } from "react";
import {
  format,
  startOfMonth,
  getDay,
  getDaysInMonth,
  addDays,
  isWeekend,
} from "date-fns";
import type { RosterEntry } from "../store/rosterStore";
import { cn } from "../lib/utils.ts";
import { ArrowRightLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  roster: RosterEntry[];
  month: number;
  year: number;
  holidayDates?: string[];
  onSwap?: (dateA: string, dateB: string) => void;
  readonly?: boolean;
}

export default function RosterCalendar({
  roster,
  month,
  year,
  holidayDates = [],
  onSwap,
  readonly,
}: Props) {
  const [swapSource, setSwapSource] = useState<RosterEntry | null>(null);
  const [swapTarget, setSwapTarget] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const start = startOfMonth(new Date(year, month));
  const totalDays = getDaysInMonth(start);
  const startDay = getDay(start); // 0=Sun

  const rosterMap = new Map<string, RosterEntry>();
  roster.forEach((r) => rosterMap.set(r.isoDate, r));

  const holidaySet = new Set(holidayDates);

  // Build calendar grid cells
  const cells: Array<{
    date: Date | null;
    iso: string;
    entry: RosterEntry | null;
    isHoliday: boolean;
    isWeekendDay: boolean;
  }> = [];

  // Leading empty cells
  for (let i = 0; i < startDay; i++) {
    cells.push({
      date: null,
      iso: "",
      entry: null,
      isHoliday: false,
      isWeekendDay: false,
    });
  }

  for (let d = 0; d < totalDays; d++) {
    const current = addDays(start, d);
    const iso = format(current, "yyyy-MM-dd");
    cells.push({
      date: current,
      iso,
      entry: rosterMap.get(iso) || null,
      isHoliday: holidaySet.has(iso),
      isWeekendDay: isWeekend(current),
    });
  }

  const handleSwapClick = (entry: RosterEntry) => {
    setSwapSource(entry);
    setSwapTarget("");
    setDialogOpen(true);
  };

  const confirmSwap = () => {
    if (swapSource && swapTarget && onSwap) {
      onSwap(swapSource.isoDate, swapTarget);
    }
    setDialogOpen(false);
    setSwapSource(null);
    setSwapTarget("");
  };

  // Available dates to swap with (other assigned dates)
  const swapOptions = roster.filter(
    (r) => swapSource && r.isoDate !== swapSource.isoDate,
  );

  return (
    <>
      <div className="glass-card overflow-hidden animate-fade-in">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border/50">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="py-2 text-center text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            if (!cell.date) {
              return (
                <div
                  key={`empty-${i}`}
                  className="min-h-[5rem] border-b border-r border-border/20"
                />
              );
            }

            const dayNum = cell.date.getDate();
            const isOff = cell.isWeekendDay || cell.isHoliday;

            return (
              <div
                key={cell.iso}
                className={cn(
                  "min-h-[5rem] p-1.5 border-b border-r border-border/20 transition-colors relative group",
                  isOff && "bg-muted/30",
                  cell.entry && "hover:bg-secondary/30",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs font-mono",
                      isOff
                        ? "text-muted-foreground/50"
                        : "text-muted-foreground",
                    )}
                  >
                    {dayNum}
                  </span>
                  {cell.isHoliday && (
                    <span className="text-[10px] text-destructive font-medium">
                      Holiday
                    </span>
                  )}
                </div>

                {cell.entry ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-primary truncate flex-1">
                      {cell.entry.engineer}
                    </span>
                    {!readonly && onSwap && (
                      <button
                        onClick={() => handleSwapClick(cell.entry!)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary"
                        title="Swap engineer"
                      >
                        <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ) : isOff ? (
                  <span className="text-[10px] text-muted-foreground/40">
                    {cell.isWeekendDay ? "Weekend" : ""}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Swap Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Swap Engineer</DialogTitle>
            <DialogDescription>
              Swap{" "}
              <span className="text-primary font-medium">
                {swapSource?.engineer}
              </span>{" "}
              on <span className="font-mono">{swapSource?.date}</span> with
              another date.
            </DialogDescription>
          </DialogHeader>

          <Select value={swapTarget} onValueChange={setSwapTarget}>
            <SelectTrigger>
              <SelectValue placeholder="Select date to swap with" />
            </SelectTrigger>
            <SelectContent>
              {swapOptions.map((r) => (
                <SelectItem key={r.isoDate} value={r.isoDate}>
                  {r.date} ({r.day}) — {r.engineer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmSwap}
              disabled={!swapTarget}
              className="gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
