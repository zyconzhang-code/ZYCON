import Phaser from 'phaser';
import { EnemyDef } from '../data/enemies';
import { ElementType, getElementMultiplier } from '../data/elements';

export interface DamageResult {
  amount: number;
  killed: boolean;
  tag?: 'super' | 'resist' | 'immune';
}

interface Status {
  id: 'slow' | 'dot' | 'armor_break' | 'stun';
  value: number;
  duration: number;
  tick?: number;
  source?: string;
}

export class Enemy extends Phaser.GameObjects.Container {
  def: EnemyDef;
  hp: number;
  maxHp: number;
  armor: number;
  speed: number;
  path: Phaser.Math.Vector2[];
  pathIndex = 0;
  isFlying: boolean;
  status: Status[] = [];
  shield = 0;
  stealthActive = false;
  stealthTimer = 0;
  auraBonus = 0;
  dead = false;

  private sprite: Phaser.GameObjects.Image;
  private hpBar: Phaser.GameObjects.Rectangle;
  private hpBack: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    def: EnemyDef,
    path: Phaser.Math.Vector2[],
    isFlying: boolean,
    hpScale: number
  ) {
    super(scene, path[0].x, path[0].y);
    this.def = def;
    this.path = path;
    this.isFlying = isFlying;
    this.maxHp = def.baseHp * hpScale;
    this.hp = this.maxHp;
    this.armor = def.armor;
    this.speed = def.speed;

    if (def.traits.includes('armored')) {
      this.armor += 4;
    }

    if (def.traits.includes('shield')) {
      this.shield = this.maxHp * 0.25;
    }

    this.sprite = scene.add.image(0, 0, def.spriteKey).setScale(def.size);
    this.hpBack = scene.add.rectangle(0, def.size * 26, 36, 4, 0x1b1b1b).setOrigin(0.5);
    this.hpBar = scene.add.rectangle(0, def.size * 26, 36, 4, 0x55c96a).setOrigin(0.5);

    this.add([this.sprite, this.hpBack, this.hpBar]);
    this.setSize(32 * def.size, 32 * def.size);
    this.setDepth(5);
  }

  update(delta: number, speedMul: number, visibilityMul: number) {
    if (this.dead) return;
    this.handleStatus(delta);
    this.handleStealth(delta);
    if (this.def.traits.includes('regen')) {
      this.hp = Math.min(this.maxHp, this.hp + (this.maxHp * 0.015 * delta) / 1000);
    }

    const target = this.path[this.pathIndex + 1];
    if (!target) return;

    const speedMulTotal = this.getSpeedMultiplier() * speedMul;
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const step = (this.speed * speedMulTotal * delta) / 1000;

    if (dist <= step) {
      this.x = target.x;
      this.y = target.y;
      this.pathIndex += 1;
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
    }

    if (this.stealthActive) {
      this.alpha = 0.2;
    } else if (visibilityMul < 1 && !this.def.traits.includes('boss')) {
      this.alpha = Phaser.Math.Clamp(((this.pathIndex + 1) * visibilityMul) / this.path.length, 0.15, 1);
    } else {
      this.alpha = 1;
    }

    this.updateHpBar();
  }

  isAtEnd(): boolean {
    return this.pathIndex >= this.path.length - 1;
  }

  takeDamage(amount: number, element: ElementType): DamageResult {
    if (this.dead) return { amount: 0, killed: false };
    if (this.stealthActive) return { amount: 0, killed: false, tag: 'immune' };

    let multiplier = getElementMultiplier(element, this.def.elements);
    if (this.def.resistElements?.includes(element)) {
      multiplier *= 0.7;
    }

    let tag: DamageResult['tag'];
    if (multiplier > 1.1) tag = 'super';
    if (multiplier < 0.95) tag = 'resist';

    let damage = amount * multiplier;
    damage = Math.max(1, damage - this.armor * 0.6);

    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, damage);
      this.shield -= absorbed;
      damage -= absorbed * 0.6;
    }

    this.hp -= damage;
    if (this.hp <= 0) {
      this.dead = true;
      return { amount: damage, killed: true, tag };
    }

    return { amount: damage, killed: false, tag };
  }

  pushBack(distance: number) {
    if (this.pathIndex <= 0) return;
    const prev = this.path[this.pathIndex];
    const target = this.path[this.pathIndex + 1];
    if (!prev || !target) return;
    const dir = new Phaser.Math.Vector2(prev.x - target.x, prev.y - target.y).normalize();
    this.x += dir.x * distance;
    this.y += dir.y * distance;
  }

  applyStatus(id: Status['id'], value: number, duration: number) {
    const existing = this.status.find((s) => s.id === id);
    if (existing) {
      existing.value = Math.max(existing.value, value);
      existing.duration = Math.max(existing.duration, duration);
      return;
    }
    this.status.push({ id, value, duration, tick: 0 });
  }

  private handleStatus(delta: number) {
    this.status.forEach((status) => {
      status.duration -= delta / 1000;
      if (status.id === 'dot') {
        status.tick = (status.tick || 0) + delta / 1000;
        if (status.tick >= 1) {
          this.hp -= status.value;
          status.tick = 0;
        }
      }
    });
    this.status = this.status.filter((s) => s.duration > 0);
    if (this.hp <= 0) this.dead = true;
  }

  private handleStealth(delta: number) {
    if (!this.def.traits.includes('stealth')) return;
    this.stealthTimer -= delta / 1000;
    if (this.stealthTimer <= 0) {
      this.stealthActive = !this.stealthActive;
      this.stealthTimer = this.stealthActive ? 1.3 : 3.5;
      this.alpha = this.stealthActive ? 0.2 : 1;
    }
  }

  private updateHpBar() {
    const ratio = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    this.hpBar.width = 36 * ratio;
    this.hpBar.x = -18 + this.hpBar.width / 2;
  }

  private getSpeedMultiplier(): number {
    let mul = 1 + this.auraBonus;
    const slow = this.status.find((s) => s.id === 'slow');
    if (slow) mul *= 1 - slow.value;
    if (this.def.traits.includes('berserk')) {
      mul *= 1 + (1 - this.hp / this.maxHp) * 0.6;
    }
    return mul;
  }
}
