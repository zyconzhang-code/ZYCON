import Phaser from 'phaser';
import { MAPS } from '../data/maps';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x0b0d10, 1).setOrigin(0);
    this.add.text(width / 2, 80, 'Mythic Wardens TD', {
      fontSize: '36px',
      color: '#c9b06a'
    }).setOrigin(0.5);
    this.add.text(width / 2, 120, '选择关卡场景', {
      fontSize: '18px',
      color: '#e7e3d5'
    }).setOrigin(0.5);

    const startX = width / 2 - 330;
    MAPS.forEach((map, index) => {
      const x = startX + index * 260;
      const y = 200;
      const card = this.createMapCard(x, y, map.name, map.description, () => {
        this.scene.start('GameScene', { mapId: map.id });
      });
      this.add.existing(card);
    });

    this.add.text(width / 2, height - 60, '提示：Space 暂停，1/2/3 切换速度，右键取消放置', {
      fontSize: '14px',
      color: '#6ab7c9'
    }).setOrigin(0.5);
  }

  private createMapCard(
    x: number,
    y: number,
    title: string,
    description: string,
    onClick: () => void
  ) {
    const container = this.add.container(0, 0);
    const bg = this.add.rectangle(x, y, 220, 260, 0x151b22, 0.95).setOrigin(0);
    const border = this.add.rectangle(x, y, 220, 260, 0xc9b06a, 0.0).setOrigin(0);
    border.setStrokeStyle(2, 0xc9b06a, 0.6);
    const titleText = this.add.text(x + 16, y + 16, title, {
      fontSize: '18px',
      color: '#c9b06a'
    });
    const descText = this.add.text(x + 16, y + 54, description, {
      fontSize: '14px',
      color: '#e7e3d5',
      wordWrap: { width: 188 }
    });
    const hint = this.add.text(x + 16, y + 214, '点击进入', {
      fontSize: '13px',
      color: '#6ab7c9'
    });

    container.add([bg, border, titleText, descText, hint]);
    container.setInteractive(new Phaser.Geom.Rectangle(x, y, 220, 260), Phaser.Geom.Rectangle.Contains);
    container.on('pointerdown', onClick);
    container.on('pointerover', () => border.setStrokeStyle(2, 0x6ab7c9, 0.8));
    container.on('pointerout', () => border.setStrokeStyle(2, 0xc9b06a, 0.6));
    return container;
  }
}
