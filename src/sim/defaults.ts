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
  attack_damage: 1,
  attack_speed: 1,
  crit_chance: 0.1,
  crit_mult: 1.5,
};

export const DEFAULT_SETTNGS: SimSettings = {
  prestigeMult: 1,
  growthHP: 7,
  growthAD: 1,
  growthAS: 0.02,
  maxWaves: 5,
  rngSeed: 20251019,
  monstersPerWave: 5,
  trials: 10000,
};
