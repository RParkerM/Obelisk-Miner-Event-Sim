import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

type SummaryRow = { metric: string; value: number | string };
type Props = { summary: SummaryRow[] | null };

export function SummaryList({ summary }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4"><CardTitle>Trials Summary</CardTitle></CardHeader>
      <CardContent className="pt-0">
        {!summary ? (
          <p className="text-sm text-gray-500">Run the simulation to see summary statistics.</p>
        ) : (
          <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
            {summary.map((s) => (
              <li key={s.metric} className="flex justify-between">
                <span className="text-gray-500">{s.metric}</span>
                <span className="font-medium">{s.value}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
