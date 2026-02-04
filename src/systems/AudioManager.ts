export type MusicTheme = 'forest' | 'lava' | 'coast';

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicNodes: OscillatorNode[] = [];
  private unlocked = false;
  private masterVolume = 0.7;
  private musicVolume = 0.5;
  private sfxVolume = 0.7;

  unlock() {
    if (this.unlocked) return;
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.masterGain.gain.value = this.masterVolume;
    this.musicGain.gain.value = this.musicVolume;
    this.sfxGain.gain.value = this.sfxVolume;
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
    this.unlocked = true;
  }

  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  setVolumes(master: number, music: number, sfx: number) {
    this.masterVolume = master;
    this.musicVolume = music;
    this.sfxVolume = sfx;
    if (this.masterGain) this.masterGain.gain.value = master;
    if (this.musicGain) this.musicGain.gain.value = music;
    if (this.sfxGain) this.sfxGain.gain.value = sfx;
  }

  playMusic(theme: MusicTheme) {
    if (!this.context || !this.musicGain) return;
    this.stopMusic();
    const base = theme === 'forest' ? 220 : theme === 'lava' ? 180 : 200;
    const chord = theme === 'forest' ? [0, 3, 7] : theme === 'lava' ? [0, 5, 7] : [0, 4, 9];
    chord.forEach((step, idx) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();
      gain.gain.value = 0.08 - idx * 0.015;
      osc.frequency.value = base * Math.pow(2, step / 12);
      osc.type = theme === 'lava' ? 'sawtooth' : 'triangle';
      osc.connect(gain);
      gain.connect(this.musicGain!);
      osc.start();
      this.musicNodes.push(osc);
    });
  }

  stopMusic() {
    this.musicNodes.forEach((osc) => {
      try {
        osc.stop();
      } catch (err) {
        // ignore
      }
    });
    this.musicNodes = [];
  }

  playSfx(type: 'place' | 'sell' | 'hit' | 'death' | 'boss' | 'event' | 'reward') {
    if (!this.context || !this.sfxGain) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    const base = {
      place: 480,
      sell: 260,
      hit: 520,
      death: 200,
      boss: 140,
      event: 420,
      reward: 360
    }[type];
    osc.frequency.value = base;
    osc.type = type === 'boss' ? 'sawtooth' : 'square';
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}
