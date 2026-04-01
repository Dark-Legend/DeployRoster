import { useState } from "react";
import { useRosterStore } from "../store/rosterStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input.tsx";
import { Plus, X, Users } from "lucide-react";

export default function EmployeeInput() {
  const { employees, addEmployee, removeEmployee } = useRosterStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    addEmployee(name, email);
    setName("");
    setEmail("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Engineers
        </h2>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Input
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 hidden sm:block"
        />
        <Button size="icon" onClick={handleAdd} disabled={!name.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {employees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {employees.map((emp) => (
            <span
              key={emp.id}
              className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-sm text-secondary-foreground"
            >
              <span className="font-mono text-xs">{emp.name}</span>
              {emp.email && (
                <span className="text-muted-foreground text-xs hidden sm:inline">
                  ({emp.email})
                </span>
              )}
              <button
                onClick={() => removeEmployee(emp.id)}
                className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
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
