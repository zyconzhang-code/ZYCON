import Phaser from 'phaser';

function createShardTexture(
  scene: Phaser.Scene,
  key: string,
  baseColor: number,
  accent: number,
  size = 64
) {
  const g = scene.add.graphics();
  g.fillStyle(baseColor, 1);
  g.beginPath();
  g.moveTo(size * 0.05, size * 0.45);
  g.lineTo(size * 0.35, size * 0.05);
  g.lineTo(size * 0.8, size * 0.1);
  g.lineTo(size * 0.95, size * 0.55);
  g.lineTo(size * 0.6, size * 0.95);
  g.lineTo(size * 0.2, size * 0.8);
  g.closePath();
  g.fillPath();
  g.fillStyle(accent, 0.65);
  g.fillTriangle(
    size * 0.3,
    size * 0.35,
    size * 0.7,
    size * 0.3,
    size * 0.5,
    size * 0.7
  );
  g.generateTexture(key, size, size);
  g.destroy();
}

function createEnemyTexture(
  scene: Phaser.Scene,
  key: string,
  baseColor: number,
  accent: number
) {
  const g = scene.add.graphics();
  g.fillStyle(baseColor, 1);
  g.fillTriangle(0, 28, 36, 0, 72, 28);
  g.fillStyle(accent, 0.8);
  g.fillTriangle(10, 34, 36, 12, 62, 34);
  g.generateTexture(key, 72, 48);
  g.destroy();
}

function createProjectileTexture(scene: Phaser.Scene) {
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 1);
  g.fillPoints(
    [
      { x: 12, y: 0 },
      { x: 24, y: 8 },
      { x: 12, y: 16 },
      { x: 0, y: 8 }
    ],
    true
  );
  g.generateTexture('projectile', 24, 16);
  g.destroy();
}

function createIconTexture(scene: Phaser.Scene) {
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 1);
  g.fillPoints(
    [
      { x: 9, y: 0 },
      { x: 18, y: 9 },
      { x: 9, y: 18 },
      { x: 0, y: 9 }
    ],
    true
  );
  g.generateTexture('icon_diamond', 18, 18);
  g.destroy();
}

function createChestTexture(scene: Phaser.Scene) {
  const g = scene.add.graphics();
  g.fillStyle(0x8b5a2b, 1);
  g.fillRoundedRect(0, 0, 40, 28, 4);
  g.fillStyle(0xd2a24c, 1);
  g.fillRect(0, 10, 40, 6);
  g.generateTexture('chest', 40, 28);
  g.destroy();
}

function createTerrainTexture(
  scene: Phaser.Scene,
  key: string,
  color1: number,
  color2: number
) {
  const g = scene.add.graphics();
  g.fillStyle(color1, 1);
  g.fillRect(0, 0, 64, 64);
  g.fillStyle(color2, 0.65);
  for (let i = 0; i < 5; i += 1) {
    g.fillRect(
      Phaser.Math.Between(0, 40),
      Phaser.Math.Between(0, 40),
      Phaser.Math.Between(12, 24),
      Phaser.Math.Between(8, 18)
    );
  }
  g.generateTexture(key, 64, 64);
  g.destroy();
}

export function createAllTextures(scene: Phaser.Scene) {
  createShardTexture(scene, 'pk_grass', 0x4caf50, 0x9be86a);
  createShardTexture(scene, 'pk_fire', 0xe85b3f, 0xffa45a);
  createShardTexture(scene, 'pk_water', 0x3f8ee8, 0x7fc5ff);
  createShardTexture(scene, 'pk_ground', 0xb9854f, 0xf3d19c);
  createShardTexture(scene, 'pk_flying', 0x6b7cff, 0xb5c9ff);
  createShardTexture(scene, 'pk_ground_hero', 0xb16e3a, 0xf0c27a, 84);
  createShardTexture(scene, 'pk_water_hero', 0x2f7ad8, 0x9ed7ff, 84);
  createShardTexture(scene, 'pk_flying_hero', 0x5568ff, 0xb7c7ff, 84);

  createEnemyTexture(scene, 'enemy_fast', 0x3b3f4a, 0x6e7686);
  createEnemyTexture(scene, 'enemy_tank', 0x4b4340, 0x8a7a6b);
  createEnemyTexture(scene, 'enemy_magic', 0x2c3a39, 0x6bc7a7);
  createEnemyTexture(scene, 'enemy_swarm', 0x3a4a52, 0x92b7c8);
  createEnemyTexture(scene, 'enemy_elite', 0x7a2f2f, 0xffc857);
  createEnemyTexture(scene, 'enemy_boss', 0x2a2a2a, 0xe85b3f);

  createProjectileTexture(scene);
  createIconTexture(scene);
  createChestTexture(scene);

  createTerrainTexture(scene, 'tex_grass', 0x1b3c2a, 0x2d5a3d);
  createTerrainTexture(scene, 'tex_water', 0x12395a, 0x1e5c83);
  createTerrainTexture(scene, 'tex_mountain', 0x2e2f39, 0x4b4d5c);
  createTerrainTexture(scene, 'tex_volcanic', 0x3a1b1b, 0x6a2a2a);
}
