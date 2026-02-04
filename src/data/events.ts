export type EventEffect =
  | 'storm_rain'
  | 'meteor_shower'
  | 'merchant'
  | 'rush'
  | 'medic'
  | 'fog'
  | 'blessing'
  | 'mana_surge'
  | 'chill_breeze'
  | 'crystal_bloom';

export interface EventDef {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  effect: EventEffect;
}

export const EVENTS: EventDef[] = [
  {
    id: 'storm_rain',
    name: '暴雨雷潮',
    description: '电属性强化，火属性削弱。',
    duration: 18,
    effect: 'storm_rain'
  },
  {
    id: 'meteor_shower',
    name: '流星雨',
    description: '路径随机落石，敌我皆受影响。',
    duration: 12,
    effect: 'meteor_shower'
  },
  {
    id: 'merchant',
    name: '游商到来',
    description: '短时间内塔价折扣。',
    duration: 15,
    effect: 'merchant'
  },
  {
    id: 'rush',
    name: '敌潮突袭',
    description: '下一波数量增加但金币奖励更高。',
    duration: 1,
    effect: 'rush'
  },
  {
    id: 'medic',
    name: '医疗补给',
    description: '立即回复生命值。',
    duration: 1,
    effect: 'medic'
  },
  {
    id: 'fog',
    name: '迷雾蔓延',
    description: '敌人出现更突然，视野缩小。',
    duration: 16,
    effect: 'fog'
  },
  {
    id: 'blessing',
    name: '守护祝福',
    description: '全塔伤害提升。',
    duration: 15,
    effect: 'blessing'
  },
  {
    id: 'mana_surge',
    name: '潮能涌动',
    description: '全塔攻速提升。',
    duration: 15,
    effect: 'mana_surge'
  },
  {
    id: 'chill_breeze',
    name: '寒风降临',
    description: '敌人移动速度下降。',
    duration: 15,
    effect: 'chill_breeze'
  },
  {
    id: 'crystal_bloom',
    name: '晶簇盛放',
    description: '随机三座塔射程提升。',
    duration: 20,
    effect: 'crystal_bloom'
  }
];
