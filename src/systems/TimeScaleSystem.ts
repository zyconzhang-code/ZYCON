import Phaser from 'phaser';

export class TimeScaleSystem {
  private scene: Phaser.Scene;
  private speed = 1;
  private paused = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.apply();
  }

  setSpeed(speed: number) {
    this.speed = Phaser.Math.Clamp(speed, 1, 3);
    this.apply();
  }

  togglePause() {
    this.paused = !this.paused;
    this.apply();
  }

  setPause(state: boolean) {
    this.paused = state;
    this.apply();
  }

  getScale(): number {
    return this.paused ? 0 : this.speed;
  }

  isPaused(): boolean {
    return this.paused;
  }

  getSpeed(): number {
    return this.speed;
  }

  private apply() {
    const scale = this.getScale();
    this.scene.time.timeScale = scale === 0 ? 0.0001 : scale;
    this.scene.tweens.timeScale = scale === 0 ? 0.0001 : scale;
  }
}
