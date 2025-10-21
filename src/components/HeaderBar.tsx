import React from "react";
import { RotateCcw, Play } from "lucide-react";
import { Button } from "../ui/Button";

type Props = {
  onRun: () => void;
  onReset: () => void;
  running: boolean;
  title?: string;
};
export function HeaderBar({ onRun, onReset, running, title = "Wave Combat Simulator" }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="flex gap-2">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button onClick={onRun} className="gap-2" disabled={running}>
          <Play className="h-4 w-4" /> {running ? "Running..." : "Run Simulation"}
        </Button>
      </div>
    </div>
  );
}