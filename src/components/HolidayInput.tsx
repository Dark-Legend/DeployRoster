import { useState } from "react";
import { useRosterStore } from "../store/rosterStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { Plus, X, CalendarOff } from "lucide-react";
import { format, parse, isValid, getDaysInMonth } from "date-fns";

export default function HolidayInput() {
  const { holidays, addHoliday, removeHoliday, month, year } = useRosterStore();
  const [day, setDay] = useState("");
  const [label, setLabel] = useState("");

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleAdd = () => {
    const dayNum = parseInt(day);
    const maxDays = getDaysInMonth(new Date(year, month));
    if (isNaN(dayNum) || dayNum < 1 || dayNum > maxDays) return;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
    if (!isValid(parsed)) return;

    addHoliday(dateStr, label.trim() || `${MONTHS[month]} ${dayNum}`);
    setDay("");
    setLabel("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <CalendarOff className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Holidays
        </h2>
        <span className="text-xs text-muted-foreground ml-auto">
          {MONTHS[month]} {year}
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Day (e.g. 8)"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-28"
          min={1}
          max={getDaysInMonth(new Date(year, month))}
        />
        <Input
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button size="icon" onClick={handleAdd} disabled={!day}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {holidays.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {holidays.map((h) => (
            <span
              key={h.date}
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 text-destructive px-2.5 py-1 text-sm"
            >
              <span className="font-mono text-xs">
                {format(new Date(h.date + "T00:00:00"), "MMM d")}
              </span>
              {h.label && <span className="text-xs opacity-70">{h.label}</span>}
              <button
                onClick={() => removeHoliday(h.date)}
                className="ml-0.5 hover:text-destructive/80 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
