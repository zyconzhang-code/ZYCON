import Phaser from 'phaser';

export class Tooltip {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bg = scene.add.rectangle(0, 0, 220, 80, 0x0f141a, 0.9).setOrigin(0);
    this.text = scene.add.text(8, 6, '', {
      fontSize: '12px',
      color: '#e7e3d5',
      wordWrap: { width: 200 }
    });
    this.container = scene.add.container(0, 0, [this.bg, this.text]);
    this.container.setDepth(2000);
    this.container.setVisible(false);
  }

  show(content: string, x: number, y: number) {
    this.text.setText(content);
    const height = Math.max(60, this.text.height + 14);
    this.bg.setSize(220, height);
    this.container.setPosition(x, y);
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }
}
