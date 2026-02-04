import Phaser from 'phaser';
import { TOWERS } from '../data/towers';
import { ENEMIES } from '../data/enemies';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.createTextures();
    this.scene.start('MenuScene');
  }

  private createTextures() {
    const g = this.add.graphics();

    const createMonster = (key: string, body: number, accent: number, style: number, size = 52) => {
      g.clear();
      g.fillStyle(body, 1);
      g.fillRoundedRect(4, 8, size - 8, size - 16, 12);
      g.fillStyle(accent, 1);
      if (style % 3 === 0) {
        g.fillTriangle(size * 0.2, size * 0.2, size * 0.4, 2, size * 0.6, size * 0.2);
        g.fillTriangle(size * 0.4, size * 0.85, size * 0.5, size * 0.65, size * 0.6, size * 0.85);
      } else if (style % 3 === 1) {
        g.fillCircle(size * 0.25, size * 0.3, 6);
        g.fillCircle(size * 0.75, size * 0.3, 6);
        g.fillTriangle(size * 0.5, size * 0.9, size * 0.6, size * 0.7, size * 0.7, size * 0.9);
      } else {
        g.fillRect(size * 0.15, size * 0.15, size * 0.2, size * 0.2);
        g.fillRect(size * 0.65, size * 0.15, size * 0.2, size * 0.2);
        g.fillTriangle(size * 0.2, size * 0.75, size * 0.4, size * 0.55, size * 0.6, size * 0.75);
      }
      g.lineStyle(3, 0x0d0f12, 0.7);
      g.strokeRoundedRect(4, 8, size - 8, size - 16, 12);
      g.generateTexture(key, size, size);
    };

    const createEnemy = (key: string, body: number, accent: number, style: number, size = 44) => {
      g.clear();
      g.fillStyle(body, 1);
      g.fillRoundedRect(4, 6, size - 8, size - 12, 10);
      g.fillStyle(accent, 1);
      if (style % 2 === 0) {
        g.fillTriangle(6, size - 10, size * 0.3, size * 0.6, size * 0.5, size - 8);
        g.fillTriangle(size - 6, size - 10, size * 0.7, size * 0.6, size * 0.5, size - 8);
      } else {
        g.fillRect(size * 0.2, size * 0.2, size * 0.2, size * 0.15);
        g.fillRect(size * 0.6, size * 0.2, size * 0.2, size * 0.15);
        g.fillCircle(size * 0.5, size * 0.6, 6);
      }
      g.lineStyle(2, 0x0d0f12, 0.6);
      g.strokeRoundedRect(4, 6, size - 8, size - 12, 10);
      g.generateTexture(key, size, size);
    };

    const palette = [0xe35d3a, 0x3a8fe3, 0x4ca66b, 0xe3c13a, 0x7ed0e8, 0xb68c5a, 0x8ad6c4, 0xf2e3a0, 0x6d5a9c];

    TOWERS.forEach((tower, index) => {
      createMonster(tower.spriteKey, palette[index % palette.length], 0x1b1b1b, index, 56);
    });
    ENEMIES.forEach((enemy, index) => {
      createEnemy(enemy.spriteKey, palette[(index + 3) % palette.length], 0x0f141a, index, 46);
    });

    // Projectiles
    g.clear();
    g.fillStyle(0xc9b06a, 1);
    g.fillTriangle(6, 0, 12, 6, 6, 12);
    g.fillTriangle(6, 0, 0, 6, 6, 12);
    g.generateTexture('projectile_basic', 12, 12);

    // Decorations
    const createDecor = (key: string, color: number, accent: number) => {
      g.clear();
      g.fillStyle(color, 1);
      g.fillRoundedRect(2, 8, 28, 28, 6);
      g.fillStyle(accent, 1);
      g.fillTriangle(0, 10, 16, 0, 32, 10);
      g.generateTexture(key, 32, 36);
    };

    createDecor('decor_tree', 0x345c3a, 0x6b8f5a);
    createDecor('decor_rock', 0x4b4b4b, 0x7a7a7a);
    createDecor('decor_ruin', 0x5a4a3a, 0x8a7a6a);
    createDecor('decor_crystal', 0x3c6f9c, 0x8ad6c4);
    createDecor('decor_coral', 0x5a3a4a, 0x9c6f7a);
    createDecor('decor_bone', 0x6a5d4a, 0xc9b06a);

    // Ground textures
    const createGround = (key: string, base: number, shadow: number, accent: number) => {
      g.clear();
      g.fillStyle(base, 1);
      g.fillRect(0, 0, 48, 48);
      g.fillStyle(shadow, 0.6);
      for (let i = 0; i < 8; i += 1) {
        g.fillCircle(Phaser.Math.Between(4, 44), Phaser.Math.Between(4, 44), Phaser.Math.Between(2, 4));
      }
      g.fillStyle(accent, 0.5);
      for (let i = 0; i < 5; i += 1) {
        g.fillRect(Phaser.Math.Between(0, 40), Phaser.Math.Between(0, 40), 6, 6);
      }
      g.generateTexture(key, 48, 48);
    };

    createGround('ground_forest', 0x2c3f2d, 0x1b2620, 0x5b8a6d);
    createGround('ground_lava', 0x3a1b1b, 0x1c0b0b, 0x9c3b2f);
    createGround('ground_coast', 0x223241, 0x111c25, 0x3b6e7e);
  }
}
