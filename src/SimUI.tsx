import React from "react";
import { useWaveSim } from "./hooks/useWaveSim";
import { HeaderBar } from "./components/HeaderBar";
import { ControlsPanel } from "./components/ControlsPanel";
import { SummaryList } from "./components/SummaryList";
import { Histogram } from "./components/Histogram";
import { WaveTable } from "./components/WaveTable";

export default function WaveSimUI() {
  const sim = useWaveSim();
  console.log(sim.trialRows);
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <HeaderBar onRun={sim.run} onReset={sim.reset} running={sim.running} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-4">
          <ControlsPanel
            player={sim.player}
            setPlayer={sim.setPlayer}
            enemy={sim.enemy}
            setEnemy={sim.setEnemy}
            settings={sim.settings}
            setSettings={sim.setSettings}
          />
        </div>
        <div className="lg:col-span-8 space-y-4">
          <SummaryList summary={sim.summary} />
          <Histogram rows={sim.trialRows} />
          <WaveTable run={sim.singleRun} />
        </div>
      </div>
    </div>
  );
}
