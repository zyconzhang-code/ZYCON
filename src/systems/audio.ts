import { ElementType } from '../data/elements';

export type ThemeType = 'forest' | 'coast' | 'lava';

export class AmbientAudio {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private currentTheme: ThemeType | null = null;

  private ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  switchTheme(theme: ThemeType, enabled: boolean) {
    this.ensure();
    if (!enabled) {
      this.stop();
      return;
    }
    if (this.currentTheme === theme) return;
    this.stop();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    const freq = theme === 'forest' ? 160 : theme === 'coast' ? 120 : 90;
    gain.gain.value = 0.025;
    osc.frequency.value = freq;
    osc.connect(gain).connect(this.ctx!.destination);
    osc.start();
    this.osc = osc;
    this.gain = gain;
    this.currentTheme = theme;
  }

  playShot(element: ElementType, enabled: boolean) {
    if (!enabled) return;
    this.ensure();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'triangle';
    const freq =
      element === 'fire'
        ? 420
        : element === 'water'
          ? 280
      : element === 'grass'
        ? 360
        : element === 'earth'
          ? 220
          : element === 'wind'
            ? 320
            : 300;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.12);
    osc.connect(gain).connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.12);
  }

  stop() {
    if (this.osc) {
      this.osc.stop();
      this.osc.disconnect();
    }
    this.osc = null;
    this.gain = null;
  }
}
