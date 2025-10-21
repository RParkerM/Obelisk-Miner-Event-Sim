import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { NumberField } from "./NumberField";
import { Combatant } from "../sim/types";

type Settings = {
  prestigeMult: number;
  growthHP: number;
  growthAD: number;
  maxWaves: number;
  rngSeed: number;
  monstersPerWave: number;
  trials: number;
};

type Props = {
  player: Combatant;
  setPlayer: (c: Combatant) => void;
  enemy: Combatant;
  setEnemy: (c: Combatant) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
};

export function ControlsPanel({ player, setPlayer, enemy, setEnemy, settings, setSettings }: Props) {
  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="py-4"><CardTitle>Player Stats</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="p-hp" label="Max HP" value={player.max_hp}
              onChange={(v) => setPlayer({ ...player, max_hp: v })} />
            <NumberField id="p-ad" label="Attack Damage" value={player.attack_damage}
              onChange={(v) => setPlayer({ ...player, attack_damage: v })} />
            <NumberField id="p-as" label="Attack Speed" value={player.attack_speed}
              onChange={(v) => setPlayer({ ...player, attack_speed: v })} />
            <NumberField id="p-cc" label="Crit Chance" value={player.crit_chance}
              onChange={(v) => setPlayer({ ...player, crit_chance: v })} suffix="0..1" />
            <NumberField id="p-cm" label="Crit Mult" value={player.crit_mult}
              onChange={(v) => setPlayer({ ...player, crit_mult: v })} />
            <NumberField id="p-bc" label="Block Chance" value={player.block_chance ?? 0}
              onChange={(v) => setPlayer({ ...player, block_chance: v })} suffix="0..1" />
            <NumberField id="p-pre" label="Prestige Multiplier" value={settings.prestigeMult}
              onChange={(v) => setSettings({ ...settings, prestigeMult: v })} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm mt-4">
        <CardHeader className="py-4"><CardTitle>Enemy Base Stats (Wave 1)</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="e-hp" label="Max HP" value={enemy.max_hp}
              onChange={(v) => setEnemy({ ...enemy, max_hp: v })} />
            <NumberField id="e-ad" label="Attack Damage" value={enemy.attack_damage}
              onChange={(v) => setEnemy({ ...enemy, attack_damage: v })} />
            <NumberField id="e-as" label="Attack Speed" value={enemy.attack_speed}
              onChange={(v) => setEnemy({ ...enemy, attack_speed: v })} />
            <NumberField id="e-cc" label="Crit Chance" value={enemy.crit_chance}
              onChange={(v) => setEnemy({ ...enemy, crit_chance: v })} suffix="0..1" />
            <NumberField id="e-cm" label="Crit Mult" value={enemy.crit_mult}
              onChange={(v) => setEnemy({ ...enemy, crit_mult: v })} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm mt-4">
        <CardHeader className="py-4"><CardTitle>Wave & Trial Settings</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="g-hp" label="Enemy HP Growth / wave" value={settings.growthHP}
              onChange={(v) => setSettings({ ...settings, growthHP: v })} />
            <NumberField id="g-ad" label="Enemy AD Growth / wave" value={settings.growthAD}
              onChange={(v) => setSettings({ ...settings, growthAD: v })} />
            <NumberField id="m-pw" label="Monsters per Wave" value={settings.monstersPerWave}
              onChange={(v) => setSettings({ ...settings, monstersPerWave: Math.max(1, Math.floor(v)) })} step={1} />
            <NumberField id="t-count" label="Trials" value={settings.trials}
              onChange={(v) => setSettings({ ...settings, trials: Math.max(1, Math.floor(v)) })} step={1} />
            <NumberField id="t-max" label="Max Waves" value={settings.maxWaves}
              onChange={(v) => setSettings({ ...settings, maxWaves: Math.max(1, Math.floor(v)) })} step={1} />
            <NumberField id="seed" label="Seed" value={settings.rngSeed}
              onChange={(v) => setSettings({ ...settings, rngSeed: Math.floor(v) })} step={1} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
