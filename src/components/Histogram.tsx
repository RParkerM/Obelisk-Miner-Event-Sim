import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

type TrialRow = { trial: number; waves_cleared: number; final_hp: number };
type Props = { rows: TrialRow[] };

export function Histogram({ rows }: Props) {
  const data = useMemo(() => {
    const counts = new Map<number, number>();
    for (const r of rows) counts.set(r.waves_cleared, (counts.get(r.waves_cleared) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => ({ waves: k, count: v }));
  }, [rows]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4"><CardTitle>Distribution of Waves Cleared</CardTitle></CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="waves" label={{ value: "Waves Cleared", position: "insideBottom", offset: -4 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
