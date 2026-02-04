import Phaser from 'phaser';
import { TowerDef } from '../data/towers';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { GameState } from '../systems/GameState';
import { ElementType } from '../data/elements';
import { GameScene } from '../scenes/GameScene';

export class Tower extends Phaser.GameObjects.Container {
  def: TowerDef;
  cooldown = 0;
  skillCooldown = 0;
  rangeMul = 1;
  selected = false;

  private sprite: Phaser.GameObjects.Image;
  private rangeCircle?: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, def: TowerDef, x: number, y: number) {
    super(scene, x, y);
    this.def = def;
    this.sprite = scene.add.image(0, 0, def.spriteKey).setScale(def.size);
    this.add(this.sprite);
    this.setSize(36 * def.size, 36 * def.size);
    this.setDepth(10);
  }

  update(
    delta: number,
    enemies: Enemy[],
    projectiles: Projectile[],
    state: GameState
  ) {
    const fireRate = this.def.fireRate * state.modifiers.fireRateMul;
    this.cooldown -= (delta / 1000) * fireRate;
    this.skillCooldown -= delta / 1000;

    if (this.def.attackType === 'beam') {
      this.handleBeam(delta, enemies, state);
      return;
    }

    if (this.cooldown > 0) return;
    this.cooldown = 1;

    switch (this.def.attackType) {
      case 'ring':
      case 'knockback':
        this.attackRing(enemies, state);
        break;
      case 'cone':
        this.attackCone(enemies, state);
        break;
      case 'chain':
        this.attackChain(enemies, state);
        break;
      default:
        this.attackProjectile(enemies, projectiles, state);
        break;
    }
  }

  tryActivateSkill(state: GameState): boolean {
    if (!this.def.isHero || !this.def.activeSkill) return false;
    if (this.skillCooldown > 0) return false;
    this.skillCooldown = this.def.activeSkill.cooldown;
    const scene = this.scene as GameScene;
    scene.executeHeroSkill(this);
    return true;
  }

  setSelected(value: boolean) {
    this.selected = value;
    if (value) {
      const radius =
        this.def.rangeShape === 'ring' ? (this.def.aoeRadius || this.def.range) : this.def.range;
      this.rangeCircle = this.scene.add.circle(
        this.x,
        this.y,
        radius * this.rangeMul,
        0x6ab7c9,
        0.12
      );
      this.rangeCircle.setStrokeStyle(2, 0x6ab7c9, 0.4);
      this.rangeCircle.setDepth(2);
    } else if (this.rangeCircle) {
      this.rangeCircle.destroy();
      this.rangeCircle = undefined;
    }
  }

  applyRangeBuff(multiplier: number, duration: number) {
    this.rangeMul *= multiplier;
    this.scene.time.delayedCall(duration * 1000, () => {
      this.rangeMul /= multiplier;
    });
  }

  private handleBeam(delta: number, enemies: Enemy[], state: GameState) {
    const target = this.findTarget(enemies);
    if (!target) return;
    const inRange = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <=
      this.def.range * this.rangeMul;
    if (!inRange) return;

    const elementBonus = state.modifiers.elementBonus[this.def.elements[0]] || 0;
    const dps = (this.def.beamDps || 0) * state.modifiers.damageMul * (1 + elementBonus);
    const damage = (dps * delta) / 1000;
    const result = target.takeDamage(damage, this.def.elements[0]);

    const scene = this.scene as GameScene;
    scene.spawnBeam(this.x, this.y, target.x, target.y);
    if (result.tag) scene.spawnDamageTag(target.x, target.y, result.tag);
  }

  private attackProjectile(
    enemies: Enemy[],
    projectiles: Projectile[],
    state: GameState
  ) {
    const target = this.findTarget(enemies);
    if (!target) return;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    const speed = this.def.projectileSpeed || 300;
    const damage = this.getDamage(state);
    const element = this.def.elements[0] as ElementType;
    const pierce = this.def.pierce || 0;
    const aoe = this.def.aoeRadius || 0;

    const projectile = new Projectile(
      this.scene,
      this.x,
      this.y,
      'projectile_basic',
      angle,
      damage,
      speed,
      element,
      pierce,
      aoe,
      (enemy) => {
        const result = enemy.takeDamage(damage, element);
        if (this.def.attackType === 'dot') {
          enemy.applyStatus('dot', this.def.dotDps || 4, this.def.dotDuration || 3);
        }
        if (this.def.attackType === 'slow') {
          enemy.applyStatus('slow', this.def.slowPct || 0.25, 3);
        }
        if (this.def.attackType === 'splash' && aoe > 0) {
          this.applySplash(enemy, damage, element, aoe, enemies);
        }
        if (this.def.attackType === 'single' && this.def.critChance) {
          // crit already applied in damage
        }
        const scene = this.scene as GameScene;
        if (result.tag) scene.spawnDamageTag(enemy.x, enemy.y, result.tag);
      }
    );

    projectile.setScale(0.6);
    projectiles.push(projectile);
    this.scene.add.existing(projectile);
  }

  private attackChain(enemies: Enemy[], state: GameState) {
    const target = this.findTarget(enemies);
    if (!target) return;
    const element = this.def.elements[0];
    const damage = this.getDamage(state);
    const chainCount = this.def.chainCount || 3;
    const chainRange = this.def.chainRange || 80;
    const hit: Enemy[] = [];

    let current = target;
    let fromX = this.x;
    let fromY = this.y;
    for (let i = 0; i < chainCount; i += 1) {
      if (!current) break;
      hit.push(current);
      const result = current.takeDamage(damage * (1 - i * 0.1), element);
      const scene = this.scene as GameScene;
      if (result.tag) scene.spawnDamageTag(current.x, current.y, result.tag);
      scene.spawnChain(fromX, fromY, current.x, current.y, i === 0);

      const next = enemies.find((enemy) => {
        if (hit.includes(enemy)) return false;
        return (
          Phaser.Math.Distance.Between(current.x, current.y, enemy.x, enemy.y) <= chainRange
        );
      });
      fromX = current.x;
      fromY = current.y;
      current = next || null;
    }
  }

  private attackCone(enemies: Enemy[], state: GameState) {
    const target = this.findTarget(enemies);
    if (!target) return;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    const coneAngle = Phaser.Math.DegToRad(60);
    const range = this.def.range * this.rangeMul;
    const damage = this.getDamage(state);

    enemies.forEach((enemy) => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist > range) return;
      const dir = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      const diff = Phaser.Math.Angle.Wrap(dir - angle);
      if (Math.abs(diff) <= coneAngle / 2) {
        const result = enemy.takeDamage(damage, this.def.elements[0]);
        const scene = this.scene as GameScene;
        if (result.tag) scene.spawnDamageTag(enemy.x, enemy.y, result.tag);
      }
    });

    const scene = this.scene as GameScene;
    scene.spawnCone(this.x, this.y, angle, range);
  }

  private attackRing(enemies: Enemy[], state: GameState) {
    const radius = (this.def.aoeRadius || 70) * this.rangeMul;
    const damage = this.getDamage(state);
    const element = this.def.elements[0];

    enemies.forEach((enemy) => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= radius) {
        const result = enemy.takeDamage(damage, element);
        if (this.def.attackType === 'knockback') {
          enemy.pushBack(this.def.knockback || 18);
        }
        const scene = this.scene as GameScene;
        if (result.tag) scene.spawnDamageTag(enemy.x, enemy.y, result.tag);
      }
    });

    const scene = this.scene as GameScene;
    scene.spawnRing(this.x, this.y, radius);
  }

  private applySplash(
    center: Enemy,
    damage: number,
    element: ElementType,
    radius: number,
    enemies: Enemy[]
  ) {
    enemies.forEach((enemy) => {
      if (enemy === center) return;
      const dist = Phaser.Math.Distance.Between(center.x, center.y, enemy.x, enemy.y);
      if (dist <= radius) {
        enemy.takeDamage(damage * 0.75, element);
      }
    });
  }

  private getDamage(state: GameState): number {
    const element = this.def.elements[0];
    const elementBonus = state.modifiers.elementBonus[element] || 0;
    let dmg = this.def.damage * state.modifiers.damageMul * (1 + elementBonus);
    if (this.def.critChance && Math.random() < this.def.critChance) {
      dmg *= this.def.critMult || 1.6;
    }
    return dmg;
  }

  private findTarget(enemies: Enemy[]): Enemy | null {
    const range = this.def.range * this.rangeMul;
    let best: Enemy | null = null;
    let minDist = Infinity;
    enemies.forEach((enemy) => {
      if (enemy.dead) return;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= range && dist < minDist) {
        best = enemy;
        minDist = dist;
      }
    });
    return best;
  }
}
