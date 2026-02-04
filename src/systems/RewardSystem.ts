import Phaser from 'phaser';
import { REWARD_POOL, RewardOption } from '../data/rewards';

export class RewardSystem {
  private noUnlockStreak = 0;

  getChoices(lockedTowerCount: number): RewardOption[] {
    const choices: RewardOption[] = [];
    const pool = [...REWARD_POOL];

    for (let i = 0; i < 3; i += 1) {
      const option = this.roll(pool, lockedTowerCount);
      choices.push(option);
    }
    return choices;
  }

  private roll(pool: RewardOption[], lockedTowerCount: number): RewardOption {
    const weights = pool.map((reward) => {
      let weight = reward.weight;
      if (reward.type === 'unlock') {
        weight = lockedTowerCount > 0 ? weight : 0.2;
        if (this.noUnlockStreak >= 3) weight *= 2;
      }
      return weight;
    });

    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = Phaser.Math.FloatBetween(0, total);
    for (let i = 0; i < pool.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) {
        const option = pool[i];
        if (option.type === 'unlock') {
          this.noUnlockStreak = 0;
        } else {
          this.noUnlockStreak += 1;
        }
        return option;
      }
    }

    return pool[0];
  }
}
