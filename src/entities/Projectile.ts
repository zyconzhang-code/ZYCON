import Phaser from 'phaser';
import { ElementType } from '../data/elements';
import { Enemy } from './Enemy';

export interface ProjectileHit {
  enemy: Enemy;
  distance: number;
}

export class Projectile extends Phaser.GameObjects.Image {
  element: ElementType;
  damage: number;
  speed: number;
  pierce: number;
  aoeRadius: number;
  traveled = 0;
  maxRange = 500;
  alive = true;
  private velocity: Phaser.Math.Vector2;
  private hitSet = new Set<Enemy>();
  private onHit: (enemy: Enemy) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    angle: number,
    damage: number,
    speed: number,
    element: ElementType,
    pierce: number,
    aoeRadius: number,
    onHit: (enemy: Enemy) => void
  ) {
    super(scene, x, y, texture);
    this.damage = damage;
    this.speed = speed;
    this.element = element;
    this.pierce = pierce;
    this.aoeRadius = aoeRadius;
    this.onHit = onHit;
    this.velocity = new Phaser.Math.Vector2(
      Math.cos(angle),
      Math.sin(angle)
    ).scale(speed);
    this.setRotation(angle);
  }

  update(delta: number, enemies: Enemy[]) {
    if (!this.alive) return;
    const step = (this.speed * delta) / 1000;
    this.x += this.velocity.x * (delta / 1000);
    this.y += this.velocity.y * (delta / 1000);
    this.traveled += step;

    if (this.traveled >= this.maxRange) {
      this.alive = false;
      return;
    }

    const hits: ProjectileHit[] = [];
    enemies.forEach((enemy) => {
      if (enemy.dead) return;
      if (this.hitSet.has(enemy)) return;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= 18 + enemy.def.size * 6) {
        hits.push({ enemy, distance: dist });
      }
    });

    if (hits.length === 0) return;
    hits.sort((a, b) => a.distance - b.distance);

    for (const hit of hits) {
      this.hitSet.add(hit.enemy);
      this.onHit(hit.enemy);
      if (this.pierce <= 0) {
        this.alive = false;
        break;
      }
      this.pierce -= 1;
    }
  }
}
