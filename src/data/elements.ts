export type ElementType =
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'earth'
  | 'wind'
  | 'light'
  | 'dark'
  | 'neutral';

export const ELEMENT_NAMES: Record<ElementType, string> = {
  fire: '火',
  water: '水',
  grass: '草',
  electric: '电',
  ice: '冰',
  earth: '地',
  wind: '风',
  light: '光',
  dark: '暗',
  neutral: '无'
};

export const ELEMENT_COLORS: Record<ElementType, number> = {
  fire: 0xe35d3a,
  water: 0x3a8fe3,
  grass: 0x4ca66b,
  electric: 0xe3c13a,
  ice: 0x7ed0e8,
  earth: 0xb68c5a,
  wind: 0x8ad6c4,
  light: 0xf2e3a0,
  dark: 0x6d5a9c,
  neutral: 0xb0b0b0
};

// 伤害倍率：优势 > 1，劣势 < 1
const EFFECTIVENESS: Record<ElementType, Partial<Record<ElementType, number>>> = {
  fire: { grass: 1.25, ice: 1.2, water: 0.8 },
  water: { fire: 1.25, earth: 1.15, electric: 0.8, grass: 0.85 },
  grass: { water: 1.25, earth: 1.1, fire: 0.85, ice: 0.8 },
  electric: { water: 1.25, wind: 1.1, earth: 0.8 },
  ice: { wind: 1.25, grass: 1.1, fire: 0.85 },
  earth: { electric: 1.3, fire: 1.1, wind: 0.85 },
  wind: { grass: 1.1, earth: 1.1, ice: 0.85 },
  light: { dark: 1.3 },
  dark: { light: 1.3 },
  neutral: {}
};

export function getElementMultiplier(
  attacker: ElementType,
  defenderElements: ElementType[]
): number {
  let multiplier = 1;
  const table = EFFECTIVENESS[attacker] || {};
  defenderElements.forEach((def) => {
    const mod = table[def];
    if (mod) {
      multiplier *= mod;
    }
  });
  return Math.max(0.6, Math.min(multiplier, 1.6));
}

export function getElementLabel(elements: ElementType[]): string {
  return elements.map((el) => ELEMENT_NAMES[el]).join('/');
}
