import Phaser from 'phaser';

export class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private goldText: Phaser.GameObjects.Text;
  private lifeText: Phaser.GameObjects.Text;
  private waveText: Phaser.GameObjects.Text;
  private enemyText: Phaser.GameObjects.Text;
  private speedText: Phaser.GameObjects.Text;
  private countdownText: Phaser.GameObjects.Text;
  private bannerText: Phaser.GameObjects.Text;
  private bannerBg: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, width: number) {
    this.scene = scene;
    const bar = scene.add.rectangle(0, 0, width, 48, 0x0f141a, 0.92).setOrigin(0);
    const accent = scene.add.rectangle(0, 46, width, 2, 0xc9b06a, 0.8).setOrigin(0);
    this.goldText = scene.add.text(20, 12, '金币: 0', { fontSize: '18px', color: '#e7e3d5' });
    this.lifeText = scene.add.text(160, 12, '生命: 0', { fontSize: '18px', color: '#e7e3d5' });
    this.waveText = scene.add.text(300, 12, 'Wave: 0', { fontSize: '18px', color: '#e7e3d5' });
    this.enemyText = scene.add.text(440, 12, '敌人: 0', { fontSize: '18px', color: '#e7e3d5' });
    this.countdownText = scene.add.text(600, 12, '下一波: 0s', { fontSize: '18px', color: '#6ab7c9' });
    this.speedText = scene.add.text(760, 12, '速度: 1x', { fontSize: '18px', color: '#c9b06a' });

    this.bannerBg = scene
      .add.rectangle(width / 2, 70, width * 0.5, 30, 0x0f141a, 0.9)
      .setOrigin(0.5);
    this.bannerText = scene.add.text(width / 2, 60, '', {
      fontSize: '16px',
      color: '#e7e3d5'
    });
    this.bannerText.setOrigin(0.5, 0);
    this.bannerBg.setVisible(false);
    this.bannerText.setVisible(false);

    this.container = scene.add.container(0, 0, [
      bar,
      accent,
      this.goldText,
      this.lifeText,
      this.waveText,
      this.enemyText,
      this.countdownText,
      this.speedText,
      this.bannerBg,
      this.bannerText
    ]);
    this.container.setDepth(1000);
    this.container.setScrollFactor(0);
  }

  update(
    gold: number,
    lives: number,
    wave: number,
    enemyCount: number,
    countdown: number,
    speedLabel: string
  ) {
    this.goldText.setText(`金币: ${Math.floor(gold)}`);
    this.lifeText.setText(`生命: ${lives}`);
    this.waveText.setText(`Wave: ${wave}`);
    this.enemyText.setText(`敌人: ${enemyCount}`);
    const safeCountdown = Math.max(0, countdown);
    this.countdownText.setText(`下一波: ${safeCountdown.toFixed(1)}s`);
    this.speedText.setText(`速度: ${speedLabel}`);
  }

  showBanner(text: string, color = '#e7e3d5') {
    this.bannerText.setText(text);
    this.bannerText.setColor(color);
    this.bannerBg.setVisible(true);
    this.bannerText.setVisible(true);
    this.scene.time.delayedCall(3200, () => {
      this.bannerBg.setVisible(false);
      this.bannerText.setVisible(false);
    });
  }
}
