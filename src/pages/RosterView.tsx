import { useParams, Link } from "react-router-dom";
import { loadRoster } from "../store/rosterStore";
import RosterStats from "../components/RosterStats";
import RosterCalendar from "../components/RosterCalendar";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

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

export default function RosterView() {
  const { id } = useParams<{ id: string }>();
  const data = id ? loadRoster(id) : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <Terminal className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground mb-4">
            Roster not found or link expired.
          </p>
          <Button asChild variant="secondary">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Create New Roster
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Terminal className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            Deploy<span className="gradient-text">Roster</span>
          </h1>
          <span className="text-sm text-muted-foreground ml-auto font-mono">
            {MONTHS[data.month]} {data.year}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <RosterStats
          roster={data.roster}
          employeeCount={data.employees.length}
        />
        <RosterCalendar
          roster={data.roster}
          month={data.month}
          year={data.year}
          holidayDates={data.holidays.map((h) => h.date)}
          readonly
        />
      </main>
    </div>
  );
}
