import Phaser from 'phaser';
import { BALANCE } from '../data/balance';
import { ENEMY_MAP, EnemyDef } from '../data/enemies';

export interface SpawnInstruction {
  def: EnemyDef;
  isFlying: boolean;
  isBoss: boolean;
}

export class WaveSystem {
  private wave = 0;
  private spawnQueue: SpawnInstruction[] = [];
  private spawnTimer = 0;
  private spawning = false;
  private waveDuration = 0;

  startWave(wave: number, rush: boolean) {
    this.wave = wave;
    this.spawnQueue = this.generateWave(wave, rush);
    this.spawnTimer = 0.1;
    this.spawning = true;
    this.waveDuration = BALANCE.waveDurationBase + wave * BALANCE.waveDurationGrowth;
  }

  isSpawning(): boolean {
    return this.spawning;
  }

  getQueueCount(): number {
    return this.spawnQueue.length;
  }

  getWaveDuration(): number {
    return this.waveDuration;
  }

  update(delta: number, spawn: (instruction: SpawnInstruction) => void) {
    if (!this.spawning) return;
    this.spawnTimer -= delta / 1000;
    const interval = Math.max(0.15, 0.6 - this.wave * 0.01);
    while (this.spawnTimer <= 0 && this.spawnQueue.length > 0) {
      const next = this.spawnQueue.shift();
      if (next) spawn(next);
      this.spawnTimer += interval;
    }
    if (this.spawnQueue.length === 0) {
      this.spawning = false;
    }
  }

  private generateWave(wave: number, rush: boolean): SpawnInstruction[] {
    const list: SpawnInstruction[] = [];
    const baseCount = Math.floor(8 + wave * 1.2);
    const countMultiplier = Math.pow(BALANCE.enemyCountGrowth, Math.floor(wave / 5));
    const count = Math.floor(baseCount * countMultiplier * (rush ? 1.3 : 1));

    const pool: EnemyDef[] = [ENEMY_MAP.sprinter, ENEMY_MAP.swarm];
    if (wave >= 3) pool.push(ENEMY_MAP.brute);
    if (wave >= 5) pool.push(ENEMY_MAP.shielded);
    if (wave >= 6) pool.push(ENEMY_MAP.skyfin);
    if (wave >= 8) pool.push(ENEMY_MAP.splitter);
    if (wave >= 10) pool.push(ENEMY_MAP.resistant);
    if (wave >= 12) pool.push(ENEMY_MAP.regenerator);
    if (wave >= 14) pool.push(ENEMY_MAP.haste);
    if (wave >= 16) pool.push(ENEMY_MAP.phantom);
    if (wave >= 18) pool.push(ENEMY_MAP.berserker);
    if (wave >= 20) pool.push(ENEMY_MAP.armored);

    for (let i = 0; i < count; i += 1) {
      const def = Phaser.Utils.Array.GetRandom(pool);
      list.push({
        def,
        isFlying: def.traits.includes('flying'),
        isBoss: false
      });
    }

    if (wave % 10 === 0) {
      list.push({
        def: ENEMY_MAP.mini_boss,
        isFlying: false,
        isBoss: true
      });
    }
    if (wave % 30 === 0) {
      list.push({
        def: ENEMY_MAP.boss,
        isFlying: false,
        isBoss: true
      });
    }

    return Phaser.Utils.Array.Shuffle(list);
  }
}
