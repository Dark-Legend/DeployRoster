import type { RosterEntry } from "../store/rosterStore";
import { BarChart3, Users, Calendar } from "lucide-react";

interface Props {
  roster: RosterEntry[];
  employeeCount: number;
}

export default function RosterStats({ roster, employeeCount }: Props) {
  const totalDays = roster.length;
  const avg = employeeCount > 0 ? (totalDays / employeeCount).toFixed(1) : "0";

  const stats = [
    { label: "Working Days", value: totalDays, icon: Calendar },
    { label: "Engineers", value: employeeCount, icon: Users },
    { label: "Avg Duties", value: avg, icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 animate-fade-in">
      {stats.map((s) => (
        <div key={s.label} className="glass-card p-4 text-center">
          <s.icon className="w-4 h-4 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono gradient-text">
            {s.value}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
