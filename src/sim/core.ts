import {
  Combatant,
  EnemyDebuffs,
  FightResult,
  SimSummary,
  WaveRecord,
} from "./types";
import { makeXorShift32 } from "./rng";

export function simulateFight(
  player: Combatant,
  enemy: Combatant,
  rng: () => number,
  enemyCount = 1,
  enemyPhaseFracIn = 0
): FightResult {
  // Back-to-back enemies. Only the ACTIVE enemy attacks.
  // phase: 0 => just swung (full cooldown left), 0.5 => halfway to next swing.
  let p_hp = player.max_hp;
  let t = 0;

  let p_next = player.attack_speed > 0 ? 0 : Number.POSITIVE_INFINITY;
  const p_dt =
    player.attack_speed > 0
      ? 1 / player.attack_speed
      : Number.POSITIVE_INFINITY;
  let events = 0;

  const count = Math.max(1, Math.floor(enemyCount));
  if (player.attack_speed <= 0 || player.attack_damage <= 0) {
    return {
      win: false,
      player_hp: 0,
      time: 0,
      events,
      enemyPhaseFrac: enemyPhaseFracIn,
    };
  }

  const enemyCanDamage = enemy.attack_speed > 0 && enemy.attack_damage > 0;
  const e_dt =
    enemy.attack_speed > 0 ? 1 / enemy.attack_speed : Number.POSITIVE_INFINITY;

  // preserved enemy swing phase
  let enemyPhase = Math.max(0, Math.min(1, enemyPhaseFracIn || 0));
  // time until the active enemy's next swing
  let e_next = enemyCanDamage
    ? (1 - enemyPhase) * e_dt
    : Number.POSITIVE_INFINITY;

  for (let idx = 0; idx < count && p_hp > 0; idx++) {
    let e_hp = enemy.max_hp;

    if (!enemyCanDamage) {
      // enemy never swings; just whittle down sequentially
      const swingsNeeded = Math.ceil(
        e_hp /
          (player.attack_damage *
            (player.crit_chance >= 1 ? player.crit_mult : 1))
      );
      t += swingsNeeded * p_dt;
      continue; // phase unchanged since no enemy swings occur
    }

    const eps = 1e-12;
    while (p_hp > 0 && e_hp > 0) {
      // next event: player swing or active enemy swing
      const next_t = Math.min(p_next, t + e_next);
      const dt = next_t - t;
      t = next_t;

      // advance enemy phase by dt
      enemyPhase = Math.min(1, enemyPhase + dt / e_dt);
      e_next = (1 - enemyPhase) * e_dt;

      const playerAttacks = Math.abs(p_next - next_t) < eps;
      const enemyAttacks = enemyCanDamage && Math.abs(e_next) < eps;

      // player swing
      if (playerAttacks) {
        let dmg = player.attack_damage;
        if (rng() < player.crit_chance) dmg *= player.crit_mult;
        e_hp -= dmg;
        p_next += p_dt;
        events++;
      }

      // active enemy swing (only if still alive)
      if (e_hp > 0 && enemyAttacks) {
        const blocked = rng() < (player.block_chance ?? 0);
        if (!blocked) {
          let dmg = enemy.attack_damage;
          if (rng() < enemy.crit_chance) dmg *= enemy.crit_mult;
          p_hp -= dmg;
        }
        // reset phase after swing
        enemyPhase = 0;
        e_next = e_dt;
        events++;
      }

      if (events > 5_000_000) break; // safety
    }
    // On enemy death we preserve enemyPhase for the next enemy.
  }

  return {
    win: p_hp > 0,
    player_hp: Math.max(0, p_hp),
    time: t,
    events,
    enemyPhaseFrac: enemyPhase,
  };
}

export function scaleEnemy(
  base: Combatant,
  waveIndex: number,
  growthHP: number,
  growthAD: number,
  growthAS: number,
  growthCC: number,
  growthCD: number,
  debuffs: EnemyDebuffs
): Combatant {
  const {
    reducedAttackDamage,
    reducedAttackSpeed,
    reducedCritChance,
    reducedCritDamage,
  } = debuffs;
  const extraHP = growthHP * (waveIndex - 1);
  const extraAS = growthAS * (waveIndex - 1);
  const extraCC = growthCC * (waveIndex - 1);
  const extraCD = growthCD * (waveIndex - 1);
  const attack_damage = Math.floor((3 / 5) * waveIndex + 3 + 1e-9);

  // const hpScale = Math.pow(growthHP, waveIndex - 1);
  // const adScale = Math.pow(growthAD, waveIndex - 1);
  return {
    max_hp: base.max_hp + extraHP,
    attack_damage: Math.max(1, attack_damage - reducedAttackDamage),
    attack_speed: Math.max(0.01,base.attack_speed + extraAS - reducedAttackSpeed),
    crit_chance: Math.max(0, base.crit_chance + extraCC - reducedCritChance),
    crit_mult: Math.max(1, base.crit_mult + extraCD - reducedCritDamage),
  };
}

export function simulateWaves(params: {
  playerBase: Combatant;
  enemyBase: Combatant;
  prestigeMult: number;
  growthHP: number;
  growthAS: number;
  growthAD: number;
  growthCC: number;
  growthCD: number;
  maxWaves: number;
  rngSeed: number;
  monstersPerWave: number;
  enemyDebuffs: EnemyDebuffs;
}): SimSummary {
  const rng = makeXorShift32(params.rngSeed);
  // xorshift32 for deterministic RNG

  const {
    playerBase,
    prestigeMult,
    maxWaves,
    enemyBase,
    growthHP,
    growthAS,
    growthAD,
    growthCC,
    growthCD,
    monstersPerWave,
    enemyDebuffs
  } = params;

  const player = {
    ...playerBase,
    max_hp: playerBase.max_hp * prestigeMult,
    attack_damage: playerBase.attack_damage * prestigeMult,
  };

  let currentHP = player.max_hp;
  let enemyPhaseFrac = 0; // carry swing phase across enemies AND waves
  const records: WaveRecord[] = [];
  let wavesCleared = 0;

  for (let wave = 1; wave <= maxWaves; wave++) {
    const enemy = scaleEnemy(
      enemyBase,
      wave,
      growthHP,
      growthAD,
      growthAS,
      growthCC,
      growthCD,
      enemyDebuffs,
    );
    const pForFight = { ...player, max_hp: currentHP };
    const result = simulateFight(
      pForFight,
      enemy,
      rng,
      monstersPerWave,
      enemyPhaseFrac
    );

    records.push({
      wave,
      enemy_hp: enemy.max_hp,
      enemy_ad: enemy.attack_damage,
      enemy_as: enemy.attack_speed,
      enemy_cc: enemy.crit_chance,
      enemy_cd: enemy.crit_mult,
      fight_time_s: result.time,
      player_hp_before: currentHP,
      player_hp_after: result.win ? result.player_hp : 0,
      won: result.win,
    });

    // preserve enemy swing phase to next wave
    enemyPhaseFrac = result.enemyPhaseFrac;

    if (result.win) {
      wavesCleared += 1;
      currentHP = result.player_hp;
      if (currentHP <= 0) break;
    } else {
      currentHP = 0;
      break;
    }
  }
  return { wavesCleared, finalHP: currentHP, records };
  // <-- move your waves loop here; return { wavesCleared, finalHP, records }
}

export function monteCarlo(params: {
  trials: number;
  playerBase: Combatant;
  enemyBase: Combatant;
  prestigeMult: number;
  growthHP: number;
  growthAD: number;
  growthAS: number;
  growthCC: number;
  growthCD: number;
  maxWaves: number;
  seed: number;
  monstersPerWave: number;
  enemyDebuffs: EnemyDebuffs;
}) {
  const {
    seed,
    trials,
    playerBase,
    enemyBase,
    prestigeMult,
    growthAD,
    growthHP,
    growthAS,
    growthCC,
    growthCD,
    maxWaves,
    monstersPerWave,
    enemyDebuffs,
  } = params;
  const rows = [];
  let s = seed >>> 0;
  const nextSeed = () => (s = (s * 1664525 + 1013904223) >>> 0);

  for (let i = 0; i < trials; i++) {
    const sim = simulateWaves({
      playerBase,
      enemyBase,
      prestigeMult,
      growthHP,
      growthAD,
      growthAS,
      growthCC,
      growthCD,
      maxWaves,
      rngSeed: nextSeed(),
      monstersPerWave,
      enemyDebuffs: enemyDebuffs
    });
    rows.push({
      trial: i + 1,
      waves_cleared: sim.wavesCleared,
      final_hp: sim.finalHP,
    });
  }
  return rows;
}
