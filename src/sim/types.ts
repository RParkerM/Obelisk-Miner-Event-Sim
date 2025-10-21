export type Combatant = {
  max_hp: number;
  attack_damage: number;
  attack_speed: number;
  crit_chance: number; // 0..1
  crit_mult: number;
  block_chance?: number; // player only
};

export type FightResult = {
  win: boolean;
  player_hp: number;
  time: number;
  events: number;
  enemyPhaseFrac: number;
};

export type WaveRecord = {
  wave: number;
  enemy_hp: number;
  enemy_ad: number;
  enemy_as: number;
  enemy_cc: number;
  enemy_cd: number;
  fight_time_s: number;
  player_hp_before: number;
  player_hp_after: number;
  won: boolean;
};

export type SimSummary = {
  wavesCleared: number;
  finalHP: number;
  records: WaveRecord[];
};

export type SimSettings = {
  prestigeMult: number;
  growthHP: number;
  growthAD: number;
  growthAS: number;
  growthCC: number;
  growthCD: number;
  maxWaves: number;
  rngSeed: number;
  monstersPerWave: number;
  trials: number;
};

export type EnemyDebuffs = {
  reducedAttackDamage: number;
  reducedAttackSpeed: number;
  reducedCritChance: number;
  reducedCritDamage: number;
}
