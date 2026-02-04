export interface SaveData {
  unlockedTowers: string[];
  heroShards: number;
  bestWave: number;
  settings: {
    master: number;
    music: number;
    sfx: number;
  };
}

const DEFAULT_SAVE: SaveData = {
  unlockedTowers: ['emberling', 'tidecaller', 'briarback', 'voltlux'],
  heroShards: 0,
  bestWave: 0,
  settings: {
    master: 0.7,
    music: 0.5,
    sfx: 0.7
  }
};

const SAVE_KEY = 'mythic-wardens-td-save';

export class SaveSystem {
  static load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { ...DEFAULT_SAVE };
      const data = JSON.parse(raw) as SaveData;
      return {
        ...DEFAULT_SAVE,
        ...data,
        settings: { ...DEFAULT_SAVE.settings, ...(data.settings || {}) }
      };
    } catch (err) {
      return { ...DEFAULT_SAVE };
    }
  }

  static save(data: SaveData) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }
}
