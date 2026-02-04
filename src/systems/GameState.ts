import { ElementType } from '../data/elements';

export interface Modifiers {
  damageMul: number;
  fireRateMul: number;
  costMul: number;
  goldMul: number;
  enemySpeedMul: number;
  enemyHpMul: number;
  elementBonus: Partial<Record<ElementType, number>>;
  visibilityMul: number;
}

export interface TempBuff {
  id: string;
  expiresAt: number;
  onExpire?: () => void;
}

export interface GameState {
  gold: number;
  lives: number;
  wave: number;
  heroShards: number;
  unlockedTowers: Set<string>;
  unlockedHeroes: Set<string>;
  modifiers: Modifiers;
  tempBuffs: TempBuff[];
  items: {
    bomb: number;
  };
  sellCooldownUntil: number;
}

export function createDefaultModifiers(): Modifiers {
  return {
    damageMul: 1,
    fireRateMul: 1,
    costMul: 1,
    goldMul: 1,
    enemySpeedMul: 1,
    enemyHpMul: 1,
    elementBonus: {},
    visibilityMul: 1
  };
}
