import { useMemo, useState } from "react";
import { monteCarlo, simulateWaves } from "../sim/core";
import { DEFAULT_PLAYER, DEFAULT_ENEMY, DEFAULT_SETTNGS } from "../sim/defaults";
import { Combatant, SimSettings } from "../sim/types";

export function useWaveSim() {
  const [player, setPlayer] = useState<Combatant>(DEFAULT_PLAYER);
  const [enemy, setEnemy]   = useState<Combatant>(DEFAULT_ENEMY);
  const [settings, setSettings] = useState<SimSettings>(DEFAULT_SETTNGS);

  const [running, setRunning] = useState(false);
  const [trialRows, setTrialRows] = useState<any[]>([]);
  const [singleRun, setSingleRun] = useState<any|null>(null);

  function run() {
    setRunning(true);
    const rows = monteCarlo({
      trials: Math.max(1, Math.floor(settings.trials)),
      playerBase: player,
      enemyBase: enemy,
      prestigeMult: settings.prestigeMult,
      growthHP: settings.growthHP,
      growthAD: settings.growthAD,
      growthAS: settings.growthAS,
      maxWaves: Math.max(1, Math.floor(settings.maxWaves)),
      seed: settings.rngSeed,
      monstersPerWave: Math.max(1, Math.floor(settings.monstersPerWave)),
    });
    setTrialRows(rows);

    const one = simulateWaves({
      playerBase: player,
      enemyBase: enemy,
      prestigeMult: settings.prestigeMult,
      growthHP: settings.growthHP,
      growthAD: settings.growthAD,
      growthAS: settings.growthAS,
      maxWaves: Math.max(1, Math.floor(settings.maxWaves)),
      rngSeed: settings.rngSeed + 777,
      monstersPerWave: Math.max(1, Math.floor(settings.monstersPerWave)),
    });
    setSingleRun(one);
    setRunning(false);
  }

  const summary = useMemo(() => {
    if (!trialRows || !trialRows.length) return null;
    const waves = trialRows.map((r) => r.waves_cleared).sort((a,b)=>a-b);
    const mean = waves.reduce((a,b)=>a+b,0)/waves.length;
    const q = (p:number) => waves[Math.min(waves.length-1, Math.floor(p*waves.length))];
    return [
      { metric: "trials", value: trialRows.length },
      { metric: "mean_waves", value: +mean.toFixed(2) },
      { metric: "median_waves", value: waves[Math.floor(waves.length/2)] },
      { metric: "p90_waves", value: q(0.90) },
      { metric: "p99_waves", value: q(0.99) },
    ];
  }, [trialRows]);

  function reset() {
    setPlayer(DEFAULT_PLAYER);
    setEnemy(DEFAULT_ENEMY);
    setSettings({ prestigeMult: 1.0, growthHP: 1.12, growthAD: 1.06, maxWaves: 500, rngSeed: 20251019, monstersPerWave: 5, trials: 750 });
    setTrialRows([]); setSingleRun(null);
  }

  return { player, setPlayer, enemy, setEnemy, settings, setSettings, running, run, reset, trialRows, singleRun, summary };
}
