export type RewardType = 'gold' | 'buff' | 'unlock' | 'item' | 'hero_shard';

export interface RewardOption {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  value?: number;
  duration?: number;
  weight: number;
}

export const REWARD_POOL: RewardOption[] = [
  {
    id: 'gold_small',
    name: '补给金币',
    description: '立即获得少量金币。',
    type: 'gold',
    value: 60,
    weight: 4
  },
  {
    id: 'gold_large',
    name: '丰厚金币',
    description: '立即获得大量金币。',
    type: 'gold',
    value: 120,
    weight: 2
  },
  {
    id: 'buff_damage',
    name: '锋刃仪式',
    description: '全塔伤害 +20% 持续 10 秒。',
    type: 'buff',
    value: 0.2,
    duration: 10,
    weight: 3
  },
  {
    id: 'buff_speed',
    name: '疾行鼓舞',
    description: '全塔攻速 +20% 持续 10 秒。',
    type: 'buff',
    value: 0.2,
    duration: 10,
    weight: 3
  },
  {
    id: 'unlock_tower',
    name: '新怪物塔',
    description: '解锁一座新的塔。',
    type: 'unlock',
    weight: 2
  },
  {
    id: 'hero_shard',
    name: '英雄碎片',
    description: '积累碎片，解锁英雄。',
    type: 'hero_shard',
    value: 1,
    weight: 1
  },
  {
    id: 'item_bomb',
    name: '一次性炸弹',
    description: '获得一枚炸弹道具。',
    type: 'item',
    value: 1,
    weight: 2
  }
];
