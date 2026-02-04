import Phaser from 'phaser';

export interface CardOption {
  id: string;
  title: string;
  description: string;
}

export class CardSelect {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Rectangle;
  private container: Phaser.GameObjects.Container;
  private titleText: Phaser.GameObjects.Text;
  private cards: Phaser.GameObjects.Container[] = [];

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;
    this.overlay = scene.add.rectangle(0, 0, width, height, 0x06080c, 0.75).setOrigin(0);
    this.titleText = scene.add.text(width / 2, 120, '选择奖励', {
      fontSize: '22px',
      color: '#e7e3d5'
    }).setOrigin(0.5);
    this.container = scene.add.container(0, 0, [this.overlay, this.titleText]);
    this.container.setDepth(3000);
    this.container.setVisible(false);
  }

  show(title: string, options: CardOption[], onSelect: (option: CardOption) => void) {
    this.container.setVisible(true);
    this.titleText.setText(title);
    this.cards.forEach((card) => card.destroy());
    this.cards = [];

    const startX = 280;
    const gap = 230;
    options.forEach((option, index) => {
      const cardX = startX + index * gap;
      const card = this.createCard(option, cardX, 240, onSelect);
      this.cards.push(card);
      this.container.add(card);
    });
  }

  hide() {
    this.container.setVisible(false);
  }

  private createCard(option: CardOption, x: number, y: number, onSelect: (option: CardOption) => void) {
    const bg = this.scene.add.rectangle(x, y, 200, 260, 0x141b22, 0.95).setOrigin(0);
    const border = this.scene.add.rectangle(x, y, 200, 260, 0xc9b06a, 0.0).setOrigin(0);
    border.setStrokeStyle(2, 0xc9b06a, 0.6);
    const title = this.scene.add.text(x + 12, y + 16, option.title, {
      fontSize: '16px',
      color: '#c9b06a'
    });
    const desc = this.scene.add.text(x + 12, y + 50, option.description, {
      fontSize: '13px',
      color: '#e7e3d5',
      wordWrap: { width: 176 }
    });
    const hint = this.scene.add.text(x + 12, y + 220, '点击选择', {
      fontSize: '12px',
      color: '#6ab7c9'
    });

    const container = this.scene.add.container(0, 0, [bg, border, title, desc, hint]);
    container.setInteractive(
      new Phaser.Geom.Rectangle(x, y, 200, 260),
      Phaser.Geom.Rectangle.Contains
    );
    container.on('pointerdown', () => {
      onSelect(option);
      this.hide();
    });
    return container;
  }
}
