import Phaser from 'phaser';

export class FloatingText {
  static spawn(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    color: string
  ) {
    const label = scene.add.text(x, y, text, {
      fontSize: '14px',
      color,
      fontStyle: 'bold'
    });
    label.setDepth(40);
    scene.tweens.add({
      targets: label,
      y: y - 20,
      alpha: 0,
      duration: 600,
      onComplete: () => label.destroy()
    });
  }
}
