import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { SimSummary } from "../sim/types";

type Props = { run: SimSummary | null };

export function WaveTable({ run }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4"><CardTitle>Single Run — Per-Wave Breakdown</CardTitle></CardHeader>
      <CardContent className="pt-0">
        {!run ? (
          <p className="text-sm text-gray-500">Run a simulation to see a per-wave table.</p>
        ) : (
          <div className="space-y-2">
            <div className="text-sm">
              Cleared <span className="font-semibold">{run.wavesCleared}</span> waves;
              Final HP: <span className="font-semibold">{run.finalHP.toFixed(2)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Wave</th>
                    <th className="py-2 pr-4">Enemy HP</th>
                    <th className="py-2 pr-4">Enemy AS</th>
                    <th className="py-2 pr-4">Enemy AD</th>
                    <th className="py-2 pr-4">Enemy CC</th>
                    <th className="py-2 pr-4">Enemy CD</th>
                    <th className="py-2 pr-4">Fight Time (s)</th>
                    <th className="py-2 pr-4">Player HP Before</th>
                    <th className="py-2 pr-4">Player HP After</th>
                    <th className="py-2 pr-4">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {run.records.map((r) => (
                    <tr key={r.wave} className="border-b last:border-0">
                      <td className="py-1 pr-4">{r.wave}</td>
                      <td className="py-1 pr-4">{r.enemy_hp.toFixed(1)}</td>
                      <td className="py-1 pr-4">{r.enemy_as.toFixed(1)}</td>
                      <td className="py-1 pr-4">{r.enemy_ad.toFixed(1)}</td>
                      <td className="py-1 pr-4">{r.enemy_cc.toFixed(3)}</td>
                      <td className="py-1 pr-4">{r.enemy_cd.toFixed(3)}</td>
                      <td className="py-1 pr-4">{r.fight_time_s.toFixed(3)}</td>
                      <td className="py-1 pr-4">{r.player_hp_before.toFixed(1)}</td>
                      <td className="py-1 pr-4">{r.player_hp_after.toFixed(1)}</td>
                      <td className="py-1 pr-4">{r.won ? "Win" : "Loss"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
