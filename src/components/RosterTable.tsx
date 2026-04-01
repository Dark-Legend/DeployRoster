import type { RosterEntry } from "../store/rosterStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Props {
  roster: RosterEntry[];
  readonly?: boolean;
}

export default function RosterTable({ roster, readonly }: Props) {
  return (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {roster.map((entry, i) => (
            <TableRow
              key={i}
              className="border-border/30 hover:bg-secondary/40 transition-colors"
            >
              <TableCell className="font-mono text-sm">{entry.date}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {entry.day}
              </TableCell>
              <TableCell className="text-sm font-medium text-primary">
                {entry.engineer}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
