import { ElementType } from './elements';

export type AttackType =
  | 'single'
  | 'pierce'
  | 'splash'
  | 'chain'
  | 'beam'
  | 'slow'
  | 'dot'
  | 'knockback'
  | 'cone'
  | 'ring';

export type RangeShape = 'circle' | 'line' | 'cone' | 'ring';

export interface ActiveSkillDef {
  name: string;
  description: string;
  cooldown: number;
  effect: 'quake' | 'tidal' | 'storm';
}

export interface TowerDef {
  id: string;
  name: string;
  cost: number;
  elements: ElementType[];
  range: number;
  fireRate: number;
  damage: number;
  attackType: AttackType;
  rangeShape: RangeShape;
  projectileSpeed?: number;
  aoeRadius?: number;
  chainCount?: number;
  chainRange?: number;
  beamDps?: number;
  slowPct?: number;
  dotDps?: number;
  dotDuration?: number;
  critChance?: number;
  critMult?: number;
  knockback?: number;
  pierce?: number;
  description: string;
  isHero?: boolean;
  spriteKey: string;
  size: number;
  passive?: string;
  activeSkill?: ActiveSkillDef;
}

export const TOWERS: TowerDef[] = [
  {
    id: 'emberling',
    name: '烬狐',
    cost: 70,
    elements: ['fire'],
    range: 150,
    fireRate: 0.9,
    damage: 16,
    attackType: 'dot',
    rangeShape: 'circle',
    projectileSpeed: 320,
    dotDps: 6,
    dotDuration: 3,
    description: '火系点射并点燃目标。',
    spriteKey: 'tower_emberling',
    size: 0.9,
    passive: '点燃：持续伤害。'
  },
  {
    id: 'tidecaller',
    name: '潮吟鳐',
    cost: 90,
    elements: ['water'],
    range: 140,
    fireRate: 1.1,
    damage: 18,
    attackType: 'splash',
    rangeShape: 'circle',
    projectileSpeed: 280,
    aoeRadius: 48,
    description: '水系溅射，对小怪克制。',
    spriteKey: 'tower_tidecaller',
    size: 1,
    passive: '溅射：范围伤害。'
  },
  {
    id: 'briarback',
    name: '荆壳兽',
    cost: 85,
    elements: ['grass'],
    range: 120,
    fireRate: 1.0,
    damage: 14,
    attackType: 'dot',
    rangeShape: 'circle',
    projectileSpeed: 260,
    dotDps: 5,
    dotDuration: 4,
    description: '草系毒刺，持续削弱。',
    spriteKey: 'tower_briarback',
    size: 0.95,
    passive: '毒素：持续伤害。'
  },
  {
    id: 'voltlux',
    name: '电影貂',
    cost: 110,
    elements: ['electric'],
    range: 160,
    fireRate: 1.2,
    damage: 15,
    attackType: 'chain',
    rangeShape: 'circle',
    chainCount: 3,
    chainRange: 90,
    description: '电系链雷，可跳跃多目标。',
    spriteKey: 'tower_voltlux',
    size: 0.9,
    passive: '链雷：最多3次跳跃。'
  },
  {
    id: 'frostglide',
    name: '霜翼鸮',
    cost: 95,
    elements: ['ice'],
    range: 150,
    fireRate: 1.0,
    damage: 12,
    attackType: 'slow',
    rangeShape: 'circle',
    projectileSpeed: 260,
    slowPct: 0.35,
    description: '冰系减速，控制走位。',
    spriteKey: 'tower_frostglide',
    size: 1,
    passive: '冻结：减速35%。'
  },
  {
    id: 'stoneram',
    name: '岩槌兽',
    cost: 120,
    elements: ['earth'],
    range: 110,
    fireRate: 1.3,
    damage: 22,
    attackType: 'knockback',
    rangeShape: 'ring',
    knockback: 20,
    description: '地系近战，击退敌人。',
    spriteKey: 'tower_stoneram',
    size: 1.1,
    passive: '击退：推回路径。'
  },
  {
    id: 'galefang',
    name: '风角兽',
    cost: 105,
    elements: ['wind'],
    range: 170,
    fireRate: 1.0,
    damage: 13,
    attackType: 'cone',
    rangeShape: 'cone',
    description: '风系扇形扫击，多目标。',
    spriteKey: 'tower_galefang',
    size: 1,
    passive: '扇形：可命中多个敌人。'
  },
  {
    id: 'shadowneedle',
    name: '影刺蛛',
    cost: 115,
    elements: ['dark'],
    range: 150,
    fireRate: 0.8,
    damage: 20,
    attackType: 'single',
    rangeShape: 'circle',
    projectileSpeed: 340,
    critChance: 0.25,
    critMult: 1.8,
    description: '暗系高暴击点射。',
    spriteKey: 'tower_shadowneedle',
    size: 0.95,
    passive: '暴击：伤害提升。'
  },
  {
    id: 'radiantstag',
    name: '辉角鹿',
    cost: 140,
    elements: ['light'],
    range: 190,
    fireRate: 1.4,
    damage: 8,
    attackType: 'beam',
    rangeShape: 'line',
    beamDps: 26,
    description: '光系持续光束。',
    spriteKey: 'tower_radiantstag',
    size: 1.05,
    passive: '光束：持续伤害。'
  },
  {
    id: 'ironscarab',
    name: '铁甲蜣',
    cost: 125,
    elements: ['earth', 'neutral'],
    range: 180,
    fireRate: 1.3,
    damage: 14,
    attackType: 'pierce',
    rangeShape: 'line',
    projectileSpeed: 420,
    pierce: 3,
    description: '穿透直线射击，克制拥挤。',
    spriteKey: 'tower_ironscarab',
    size: 0.95,
    passive: '穿透：最多3个目标。'
  },
  {
    id: 'hero_terra',
    name: '泰拉·钧岳',
    cost: 420,
    elements: ['earth'],
    range: 200,
    fireRate: 1.0,
    damage: 28,
    attackType: 'ring',
    rangeShape: 'ring',
    aoeRadius: 70,
    description: '地系巨兽，范围震荡。',
    spriteKey: 'hero_terra',
    size: 1.6,
    isHero: true,
    passive: '厚土：受到元素劣势衰减降低。',
    activeSkill: {
      name: '震地咆哮',
      description: '对全场地面敌人造成重击并短暂减速。',
      cooldown: 22,
      effect: 'quake'
    }
  },
  {
    id: 'hero_abyss',
    name: '渊潮·海魇',
    cost: 420,
    elements: ['water'],
    range: 210,
    fireRate: 1.1,
    damage: 22,
    attackType: 'splash',
    rangeShape: 'circle',
    projectileSpeed: 300,
    aoeRadius: 70,
    description: '海洋巨兽，潮汐溅射。',
    spriteKey: 'hero_abyss',
    size: 1.6,
    isHero: true,
    passive: '深海护盾：减伤10%。',
    activeSkill: {
      name: '海啸冲击',
      description: '沿路径释放巨浪，击退并伤害敌人。',
      cooldown: 24,
      effect: 'tidal'
    }
  },
  {
    id: 'hero_sky',
    name: '苍穹·裂翼',
    cost: 420,
    elements: ['wind', 'electric'],
    range: 230,
    fireRate: 0.9,
    damage: 24,
    attackType: 'chain',
    rangeShape: 'circle',
    chainCount: 4,
    chainRange: 110,
    description: '天空巨龙，风雷连锁。',
    spriteKey: 'hero_sky',
    size: 1.7,
    isHero: true,
    passive: '天穹：飞行敌人额外伤害。',
    activeSkill: {
      name: '风暴坠落',
      description: '召唤雷暴陨落，覆盖大范围随机打击。',
      cooldown: 26,
      effect: 'storm'
    }
  }
];

export const TOWER_MAP: Record<string, TowerDef> = Object.fromEntries(
  TOWERS.map((tower) => [tower.id, tower])
);
