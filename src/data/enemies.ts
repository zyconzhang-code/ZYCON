import { ElementType } from './elements';

export type EnemyTrait =
  | 'fast'
  | 'tank'
  | 'shield'
  | 'flying'
  | 'split'
  | 'resist'
  | 'regen'
  | 'haste_aura'
  | 'stealth'
  | 'berserk'
  | 'swarm'
  | 'armored'
  | 'mini_boss'
  | 'boss';

export interface EnemyDef {
  id: string;
  name: string;
  baseHp: number;
  speed: number;
  armor: number;
  reward: number;
  elements: ElementType[];
  traits: EnemyTrait[];
  spriteKey: string;
  size: number;
  resistElements?: ElementType[];
}

export const ENEMIES: EnemyDef[] = [
  {
    id: 'sprinter',
    name: '疾行蜥',
    baseHp: 55,
    speed: 70,
    armor: 0,
    reward: 5,
    elements: ['wind'],
    traits: ['fast'],
    spriteKey: 'enemy_sprinter',
    size: 0.8
  },
  {
    id: 'brute',
    name: '厚背獴',
    baseHp: 140,
    speed: 35,
    armor: 4,
    reward: 8,
    elements: ['earth'],
    traits: ['tank'],
    spriteKey: 'enemy_brute',
    size: 1.05
  },
  {
    id: 'shielded',
    name: '护盾甲螈',
    baseHp: 100,
    speed: 40,
    armor: 2,
    reward: 7,
    elements: ['light'],
    traits: ['shield'],
    spriteKey: 'enemy_shielded',
    size: 0.95
  },
  {
    id: 'skyfin',
    name: '天翼鲼',
    baseHp: 80,
    speed: 60,
    armor: 1,
    reward: 7,
    elements: ['wind'],
    traits: ['flying'],
    spriteKey: 'enemy_flying',
    size: 0.9
  },
  {
    id: 'splitter',
    name: '裂壳蜇',
    baseHp: 95,
    speed: 45,
    armor: 1,
    reward: 7,
    elements: ['dark'],
    traits: ['split'],
    spriteKey: 'enemy_splitter',
    size: 0.9
  },
  {
    id: 'resistant',
    name: '抗炎猿',
    baseHp: 110,
    speed: 42,
    armor: 2,
    reward: 8,
    elements: ['fire'],
    traits: ['resist'],
    spriteKey: 'enemy_resistant',
    size: 0.95,
    resistElements: ['fire']
  },
  {
    id: 'regenerator',
    name: '再生树灵',
    baseHp: 120,
    speed: 38,
    armor: 2,
    reward: 9,
    elements: ['grass'],
    traits: ['regen'],
    spriteKey: 'enemy_regen',
    size: 1
  },
  {
    id: 'haste',
    name: '疾咒鹫',
    baseHp: 90,
    speed: 50,
    armor: 1,
    reward: 8,
    elements: ['electric'],
    traits: ['haste_aura'],
    spriteKey: 'enemy_haste',
    size: 0.9
  },
  {
    id: 'phantom',
    name: '潜影獭',
    baseHp: 85,
    speed: 55,
    armor: 1,
    reward: 8,
    elements: ['dark'],
    traits: ['stealth'],
    spriteKey: 'enemy_phantom',
    size: 0.85
  },
  {
    id: 'berserker',
    name: '狂怒狈',
    baseHp: 130,
    speed: 40,
    armor: 1,
    reward: 9,
    elements: ['fire'],
    traits: ['berserk'],
    spriteKey: 'enemy_berserker',
    size: 1
  },
  {
    id: 'swarm',
    name: '潮群幼蜥',
    baseHp: 45,
    speed: 55,
    armor: 0,
    reward: 4,
    elements: ['water'],
    traits: ['swarm'],
    spriteKey: 'enemy_swarm',
    size: 0.7
  },
  {
    id: 'armored',
    name: '铁脊犀',
    baseHp: 160,
    speed: 32,
    armor: 6,
    reward: 10,
    elements: ['earth'],
    traits: ['armored'],
    spriteKey: 'enemy_armored',
    size: 1.1
  },
  {
    id: 'mini_boss',
    name: '守序魈',
    baseHp: 420,
    speed: 35,
    armor: 6,
    reward: 40,
    elements: ['light'],
    traits: ['mini_boss'],
    spriteKey: 'enemy_miniboss',
    size: 1.4
  },
  {
    id: 'boss',
    name: '远古核王',
    baseHp: 1200,
    speed: 28,
    armor: 10,
    reward: 120,
    elements: ['dark', 'earth'],
    traits: ['boss'],
    spriteKey: 'enemy_boss',
    size: 1.8
  }
];

export const ENEMY_MAP: Record<string, EnemyDef> = Object.fromEntries(
  ENEMIES.map((enemy) => [enemy.id, enemy])
);
