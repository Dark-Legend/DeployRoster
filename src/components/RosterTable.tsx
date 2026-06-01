"use client";

import { useState } from "react";
import type { RosterEntry } from "../store/rosterStore";
import { useRosterStore } from "../store/rosterStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Props {
  roster: RosterEntry[];
  readonly?: boolean;
  month?: number;
  year?: number;
}

export default function RosterTable({ roster, readonly, month, year }: Props) {
  const store = useRosterStore();
  const { toast } = useToast();
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<RosterEntry | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendEmail = async (entry: RosterEntry) => {
    const engineer = store.employees.find((e) => e.name === entry.engineer);

    if (!engineer?.email) {
      toast({
        title: "Email not available",
        description: `No email configured for ${entry.engineer}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedEntry(entry);
    setShowConfirm(true);
  };

  const confirmSendEmail = async () => {
    if (!selectedEntry) return;

    const engineer = store.employees.find(
      (e) => e.name === selectedEntry.engineer
    );
    if (!engineer?.email) return;

    setSendingEmail(selectedEntry.isoDate);
    setShowConfirm(false);

    try {
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

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engineerName: engineer.name,
          engineerEmail: engineer.email,
          dutyDate: selectedEntry.date,
          dutyDay: selectedEntry.day,
          monthYear: `${MONTHS[month || 0]} ${year || new Date().getFullYear()}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Email sent successfully",
          description: `Notification sent to ${engineer.email}`,
        });
      } else {
        toast({
          title: "Failed to send email",
          description: data.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[v0] Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(null);
      setSelectedEntry(null);
    }
  };

  return (
    <>
      <div className="glass-card overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Date
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Day
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Assigned Engineer
              </TableHead>
              {!readonly && (
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roster.map((entry, i) => (
              <TableRow
                key={i}
                className="border-border/30 hover:bg-secondary/40 transition-colors"
              >
                <TableCell className="font-mono text-sm">
                  {entry.date}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.day}
                </TableCell>
                <TableCell className="text-sm font-medium text-primary">
                  {entry.engineer}
                </TableCell>
                {!readonly && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendEmail(entry)}
                      disabled={sendingEmail === entry.isoDate}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {sendingEmail === entry.isoDate ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Duty Notification Email?</DialogTitle>
            <DialogDescription>
              Send a deployment duty notification email to{" "}
              <strong>{selectedEntry?.engineer}</strong> for{" "}
              <strong>{selectedEntry?.date}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSendEmail}>
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
