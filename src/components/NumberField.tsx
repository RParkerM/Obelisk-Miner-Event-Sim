import React from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number | "any";
  min?: number;
  max?: number;
  suffix?: string;
};
export function NumberField({ id, label, value, onChange, step = "any", min, max, suffix }: Props) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="number"
          step={step as any}
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        {suffix && <span className="text-sm text-gray-500 w-10 text-right">{suffix}</span>}
      </div>
    </div>
  );
}
