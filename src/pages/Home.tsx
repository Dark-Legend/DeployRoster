import { useState } from "react";
import { useRosterStore } from "../store/rosterStore";
import { generateRoster } from "../utils/rosterGenerator";
import { generatePdf } from "../utils/pdfGenerator";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import EmployeeInput from "../components/EmployeeInput";
import MonthSelector from "../components/MonthSelector";
import HolidayInput from "../components/HolidayInput";
import RosterStats from "../components/RosterStats";
import RosterCalendar from "../components/RosterCalendar";
import {
  Sparkles,
  Download,
  Link2,
  Trash2,
  Loader2,
  Terminal,
} from "lucide-react";

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

export default function Home() {
  const store = useRosterStore();
  const { toast } = useToast();
  const [shareId, setShareId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (store.employees.length === 0) {
      toast({ title: "Add at least one engineer", variant: "destructive" });
      return;
    }
    store.setIsGenerating(true);
    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 400));
    const roster = generateRoster({
      month: store.month,
      year: store.year,
      employees: store.employees.map((e) => e.name),
      holidayDates: store.holidays.map((h) => h.date),
    });
    store.setRoster(roster);
    store.setIsGenerating(false);
    setShareId(null);
  };

  const handleDownload = async () => {
    if (!store.roster) return;
    const bytes = await generatePdf({
      month: MONTHS[store.month],
      year: store.year,
      roster: store.roster,
    });
    const blob = new Blob([bytes as unknown as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `duty-roster-${MONTHS[store.month].toLowerCase()}-${store.year}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const id = store.saveAndGetShareId();
    setShareId(id);
    const url = `${window.location.origin}/roster/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard!" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Terminal className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            Deploy<span className="gradient-text">Roster</span>
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Inputs */}
        <EmployeeInput />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <MonthSelector />
          <HolidayInput />
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleGenerate}
            disabled={store.isGenerating || store.employees.length === 0}
            className="gap-2"
          >
            {store.isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate Roster
          </Button>

          {store.roster && (
            <>
              <Button
                variant="secondary"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="secondary"
                onClick={handleShare}
                className="gap-2"
              >
                <Link2 className="w-4 h-4" />
                {shareId ? "Link Copied!" : "Share Link"}
              </Button>
            </>
          )}

          {(store.employees.length > 0 || store.holidays.length > 0) && (
            <Button
              variant="ghost"
              onClick={() => {
                store.clearAll();
                setShareId(null);
              }}
              className="gap-2 text-muted-foreground ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Results */}
        {store.roster ? (
          <div className="space-y-5">
            <RosterStats
              roster={store.roster}
              employeeCount={store.employees.length}
            />
            <RosterCalendar
              roster={store.roster}
              month={store.month}
              year={store.year}
              holidayDates={store.holidays.map((h) => h.date)}
              onSwap={(a, b) => store.swapEngineers(a, b)}
            />
          </div>
        ) : (
          <div className="glass-card p-12 text-center animate-fade-in">
            <Terminal className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground text-sm">
              Add engineers and select a month to generate your deployment duty
              schedule.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
