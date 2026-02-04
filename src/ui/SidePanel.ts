import Phaser from 'phaser';
import { TowerDef } from '../data/towers';

interface TowerButton {
  container: Phaser.GameObjects.Container;
  def: TowerDef;
  setEnabled: (enabled: boolean) => void;
  setSelected: (selected: boolean) => void;
}

interface Slider {
  value: number;
  knob: Phaser.GameObjects.Ellipse;
  bar: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  onChange: (value: number) => void;
}

export class SidePanel {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Rectangle;
  private toggle: Phaser.GameObjects.Rectangle;
  private width: number;
  private collapsed = false;
  private towerButtons: TowerButton[] = [];
  private heroButtons: TowerButton[] = [];
  private itemText: Phaser.GameObjects.Text;
  private itemHandler?: () => void;
  private sliders: Slider[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    this.scene = scene;
    this.width = width;
    this.bg = scene.add.rectangle(x, y, width, height, 0x11161c, 0.92).setOrigin(0);
    this.toggle = scene
      .add.rectangle(x - 18, y + 20, 16, 60, 0x2a323a, 0.9)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });
    this.toggle.setScrollFactor(0);

    const title = scene.add.text(x + 16, y + 10, '怪物塔', {
      fontSize: '18px',
      color: '#c9b06a'
    });
    const heroTitle = scene.add.text(x + 16, y + 220, '英雄', {
      fontSize: '16px',
      color: '#6ab7c9'
    });
    const itemTitle = scene.add.text(x + 16, y + 340, '道具', {
      fontSize: '16px',
      color: '#6ab7c9'
    });
    this.itemText = scene.add.text(x + 16, y + 365, '炸弹: 0', {
      fontSize: '14px',
      color: '#e7e3d5'
    });
    this.itemText.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      if (this.itemHandler) this.itemHandler();
    });

    const audioTitle = scene.add.text(x + 16, y + 410, '音量', {
      fontSize: '16px',
      color: '#c9b06a'
    });

    this.container = scene.add.container(0, 0, [
      this.bg,
      title,
      heroTitle,
      itemTitle,
      this.itemText,
      audioTitle
    ]);
    this.container.setDepth(1000);
    this.toggle.setDepth(1001);
    this.toggle.on('pointerdown', () => this.togglePanel());

    this.sliders.push(this.createSlider('主音量', x + 16, y + 440, 0.7));
    this.sliders.push(this.createSlider('音乐', x + 16, y + 470, 0.5));
    this.sliders.push(this.createSlider('音效', x + 16, y + 500, 0.7));
  }

  setItemCount(count: number) {
    this.itemText.setText(`炸弹: ${count}`);
  }

  onItemUse(handler: () => void) {
    this.itemHandler = handler;
  }

  setTowerList(towers: TowerDef[], onSelect: (def: TowerDef) => void) {
    this.towerButtons.forEach((btn) => btn.container.destroy());
    this.towerButtons = [];

    towers.forEach((def, index) => {
      const btn = this.createTowerButton(def, index, onSelect, 36);
      this.towerButtons.push(btn);
    });
  }

  setHeroList(towers: TowerDef[], onSelect: (def: TowerDef) => void) {
    this.heroButtons.forEach((btn) => btn.container.destroy());
    this.heroButtons = [];

    towers.forEach((def, index) => {
      const btn = this.createTowerButton(def, index, onSelect, 250);
      this.heroButtons.push(btn);
    });
  }

  updateTowerAvailability(gold: number, costMul: number) {
    [...this.towerButtons, ...this.heroButtons].forEach((btn) => {
      const price = Math.floor(btn.def.cost * costMul);
      btn.setEnabled(gold >= price);
    });
  }

  clearSelection() {
    [...this.towerButtons, ...this.heroButtons].forEach((btn) => btn.setSelected(false));
  }

  setSelectedTower(id: string) {
    [...this.towerButtons, ...this.heroButtons].forEach((btn) => {
      btn.setSelected(btn.def.id === id);
    });
  }

  onVolumeChange(index: number, handler: (value: number) => void) {
    if (!this.sliders[index]) return;
    this.sliders[index].onChange = handler;
  }

  setVolumeValues(master: number, music: number, sfx: number) {
    const values = [master, music, sfx];
    this.sliders.forEach((slider, idx) => {
      slider.value = Phaser.Math.Clamp(values[idx], 0, 1);
      slider.knob.x = slider.bar.x + slider.value * slider.bar.width;
    });
  }

  getVolumeValues(): [number, number, number] {
    return [
      this.sliders[0].value,
      this.sliders[1].value,
      this.sliders[2].value
    ];
  }

  private togglePanel() {
    this.collapsed = !this.collapsed;
    const offset = this.collapsed ? this.width : 0;
    this.container.x = offset;
    this.toggle.x = this.bg.x - 18 + offset;
  }

  private createTowerButton(
    def: TowerDef,
    index: number,
    onSelect: (def: TowerDef) => void,
    startY: number
  ): TowerButton {
    const x = this.bg.x + 16;
    const y = this.bg.y + startY + index * 48;
    const buttonBg = this.scene.add.rectangle(x, y, this.width - 32, 40, 0x1c232c, 0.9).setOrigin(0);
    const name = this.scene.add.text(x + 10, y + 6, def.name, { fontSize: '14px', color: '#e7e3d5' });
    const cost = this.scene.add.text(x + 150, y + 6, `${def.cost}`, { fontSize: '14px', color: '#c9b06a' });
    const icon = this.scene.add.image(x + 26, y + 22, def.spriteKey).setScale(0.5);
    const border = this.scene
      .add.rectangle(x, y, this.width - 32, 40, 0x6ab7c9, 0.0)
      .setOrigin(0)
      .setStrokeStyle(2, 0x6ab7c9, 0);

    const container = this.scene.add.container(0, 0, [buttonBg, border, icon, name, cost]);
    container.setDepth(1001);
    container.setInteractive(
      new Phaser.Geom.Rectangle(x, y, this.width - 32, 40),
      Phaser.Geom.Rectangle.Contains
    );

    let enabled = true;
    const updateStyle = (isEnabled: boolean) => {
      buttonBg.setFillStyle(isEnabled ? 0x1c232c : 0x11161c, isEnabled ? 0.9 : 0.6);
      name.setColor(isEnabled ? '#e7e3d5' : '#6f6b62');
      cost.setColor(isEnabled ? '#c9b06a' : '#6f6b62');
    };

    container.on('pointerdown', () => {
      if (!enabled) return;
      onSelect(def);
    });

    const setEnabled = (value: boolean) => {
      enabled = value;
      updateStyle(value);
    };

    const setSelected = (selected: boolean) => {
      border.setStrokeStyle(2, 0x6ab7c9, selected ? 0.8 : 0);
    };

    this.container.add(container);

    updateStyle(true);

    return { container, def, setEnabled, setSelected };
  }

  private createSlider(label: string, x: number, y: number, initial: number): Slider {
    const text = this.scene.add.text(x, y - 2, label, { fontSize: '12px', color: '#e7e3d5' });
    const bar = this.scene.add.rectangle(x + 90, y + 6, 100, 6, 0x2a323a, 1).setOrigin(0);
    const knob = this.scene.add.ellipse(bar.x + bar.width * initial, y + 9, 10, 10, 0xc9b06a, 1);

    knob.setInteractive({ draggable: true, useHandCursor: true });
    this.scene.input.setDraggable(knob);

    const slider: Slider = {
      value: initial,
      knob,
      bar,
      label: text,
      onChange: () => undefined
    };

    knob.on('drag', (_: Phaser.Input.Pointer, dragX: number) => {
      const clamped = Phaser.Math.Clamp(dragX, bar.x, bar.x + bar.width);
      knob.x = clamped;
      slider.value = (clamped - bar.x) / bar.width;
      slider.onChange(slider.value);
    });

    this.container.add([text, bar, knob]);

    return slider;
  }
}
