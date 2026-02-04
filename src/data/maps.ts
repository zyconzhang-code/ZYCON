export interface Point {
  x: number;
  y: number;
}

export interface Decoration {
  x: number;
  y: number;
  type: 'tree' | 'rock' | 'ruin' | 'crystal' | 'coral' | 'bone';
}

export interface MapDef {
  id: string;
  name: string;
  theme: 'forest' | 'lava' | 'coast';
  description: string;
  cols: number;
  rows: number;
  tileSize: number;
  paths: Point[][]; // 多路径分支
  airPath: Point[];
  blocked: Point[];
  decorations: Decoration[];
  bgm: string;
  palette: {
    base: number;
    shadow: number;
    accent: number;
  };
}

export const MAPS: MapDef[] = [
  {
    id: 'forest',
    name: '幽林盆地',
    theme: 'forest',
    description: '林地湿润，路径分叉，适合控制型塔。',
    cols: 20,
    rows: 12,
    tileSize: 48,
    paths: [
      [
        { x: 0, y: 5 },
        { x: 4, y: 5 },
        { x: 7, y: 3 },
        { x: 10, y: 3 },
        { x: 13, y: 6 },
        { x: 17, y: 6 },
        { x: 19, y: 8 }
      ],
      [
        { x: 0, y: 6 },
        { x: 4, y: 6 },
        { x: 7, y: 8 },
        { x: 10, y: 8 },
        { x: 13, y: 5 },
        { x: 17, y: 5 },
        { x: 19, y: 4 }
      ]
    ],
    airPath: [
      { x: 0, y: 2 },
      { x: 6, y: 2 },
      { x: 12, y: 4 },
      { x: 19, y: 4 }
    ],
    blocked: [
      { x: 5, y: 1 },
      { x: 5, y: 2 },
      { x: 14, y: 9 },
      { x: 15, y: 9 }
    ],
    decorations: [
      { x: 3, y: 2, type: 'tree' },
      { x: 12, y: 2, type: 'tree' },
      { x: 16, y: 9, type: 'rock' },
      { x: 8, y: 10, type: 'ruin' }
    ],
    bgm: 'bgm_forest',
    palette: {
      base: 0x2c3f2d,
      shadow: 0x1b2620,
      accent: 0x5b8a6d
    }
  },
  {
    id: 'lava',
    name: '赤焰裂谷',
    theme: 'lava',
    description: '熔岩流动，路径较窄且急转。',
    cols: 20,
    rows: 12,
    tileSize: 48,
    paths: [
      [
        { x: 0, y: 8 },
        { x: 4, y: 8 },
        { x: 6, y: 6 },
        { x: 8, y: 6 },
        { x: 10, y: 4 },
        { x: 12, y: 4 },
        { x: 15, y: 7 },
        { x: 19, y: 7 }
      ],
      [
        { x: 0, y: 3 },
        { x: 5, y: 3 },
        { x: 7, y: 5 },
        { x: 10, y: 5 },
        { x: 13, y: 7 },
        { x: 19, y: 7 }
      ]
    ],
    airPath: [
      { x: 0, y: 1 },
      { x: 7, y: 2 },
      { x: 14, y: 3 },
      { x: 19, y: 4 }
    ],
    blocked: [
      { x: 9, y: 1 },
      { x: 9, y: 2 },
      { x: 9, y: 3 },
      { x: 14, y: 10 }
    ],
    decorations: [
      { x: 2, y: 10, type: 'rock' },
      { x: 6, y: 1, type: 'bone' },
      { x: 11, y: 9, type: 'rock' },
      { x: 16, y: 2, type: 'ruin' }
    ],
    bgm: 'bgm_lava',
    palette: {
      base: 0x3a1b1b,
      shadow: 0x1c0b0b,
      accent: 0x9c3b2f
    }
  },
  {
    id: 'coast',
    name: '潮汐海岸',
    theme: 'coast',
    description: '海风强劲，路径分叉明显。',
    cols: 20,
    rows: 12,
    tileSize: 48,
    paths: [
      [
        { x: 0, y: 4 },
        { x: 5, y: 4 },
        { x: 8, y: 6 },
        { x: 11, y: 6 },
        { x: 14, y: 3 },
        { x: 17, y: 3 },
        { x: 19, y: 6 }
      ],
      [
        { x: 0, y: 7 },
        { x: 6, y: 7 },
        { x: 9, y: 5 },
        { x: 12, y: 5 },
        { x: 15, y: 8 },
        { x: 19, y: 8 }
      ]
    ],
    airPath: [
      { x: 0, y: 10 },
      { x: 8, y: 9 },
      { x: 15, y: 7 },
      { x: 19, y: 6 }
    ],
    blocked: [
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 15, y: 1 },
      { x: 15, y: 2 }
    ],
    decorations: [
      { x: 4, y: 2, type: 'coral' },
      { x: 10, y: 1, type: 'coral' },
      { x: 13, y: 9, type: 'rock' },
      { x: 17, y: 10, type: 'crystal' }
    ],
    bgm: 'bgm_coast',
    palette: {
      base: 0x223241,
      shadow: 0x111c25,
      accent: 0x3b6e7e
    }
  }
];

export const MAP_MAP: Record<string, MapDef> = Object.fromEntries(
  MAPS.map((map) => [map.id, map])
);
