import { Combatant, SimSettings } from "./types";

export const DEFAULT_PLAYER: Combatant = {
  max_hp: 100,
  attack_damage: 10,
  attack_speed: 1.5,
  crit_chance: 0.25,
  crit_mult: 2.0,
  block_chance: 0.0,
};

export const DEFAULT_ENEMY: Combatant = {
  max_hp: 11,
  attack_damage: 3,
  attack_speed: 0.82,
  crit_chance: 0.01,
  crit_mult: 1.05,
};

export const DEFAULT_SETTNGS: SimSettings = {
  prestigeMult: 1,
  growthHP: 7,
  growthAD: 1,
  growthAS: 0.02,
  growthCC: 0.01,
  growthCD: 0.05,
  maxWaves: 250,
  rngSeed: 20251019,
  monstersPerWave: 5,
  trials: 10000,
};
