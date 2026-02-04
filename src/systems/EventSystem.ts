import Phaser from 'phaser';
import { EVENTS, EventDef } from '../data/events';
import { GameState } from './GameState';
import { GameScene } from '../scenes/GameScene';

interface ActiveEvent {
  def: EventDef;
  remaining: number;
}

export class EventSystem {
  private scene: GameScene;
  private state: GameState;
  private activeEvents: ActiveEvent[] = [];
  private pendingRush = false;

  constructor(scene: GameScene, state: GameState) {
    this.scene = scene;
    this.state = state;
  }

  getActiveEvents(): EventDef[] {
    return this.activeEvents.map((event) => event.def);
  }

  hasPendingRush(): boolean {
    return this.pendingRush;
  }

  consumeRush(): boolean {
    const active = this.pendingRush;
    this.pendingRush = false;
    return active;
  }

  triggerRandomEvent(): EventDef | null {
    const def = Phaser.Utils.Array.GetRandom(EVENTS);
    if (!def) return null;
    this.applyEvent(def);
    return def;
  }

  private applyEvent(def: EventDef) {
    this.activeEvents.push({ def, remaining: def.duration });

    switch (def.effect) {
      case 'storm_rain':
        this.state.modifiers.elementBonus.electric = 0.2;
        this.state.modifiers.elementBonus.fire = -0.2;
        break;
      case 'merchant':
        this.state.modifiers.costMul *= 0.8;
        break;
      case 'blessing':
        this.state.modifiers.damageMul *= 1.2;
        break;
      case 'mana_surge':
        this.state.modifiers.fireRateMul *= 1.2;
        break;
      case 'chill_breeze':
        this.state.modifiers.enemySpeedMul *= 0.85;
        break;
      case 'fog':
        this.state.modifiers.visibilityMul = 0.7;
        break;
      case 'rush':
        this.pendingRush = true;
        break;
      case 'medic':
        this.scene.addLives(4);
        break;
      case 'meteor_shower':
        this.scene.startMeteorShower(def.duration);
        break;
      case 'crystal_bloom':
        this.scene.applyCrystalBloom(def.duration);
        break;
    }

    this.scene.showEventBanner(def);
    this.scene.playEventSfx();
  }

  update(deltaSeconds: number) {
    const expired: ActiveEvent[] = [];
    this.activeEvents.forEach((event) => {
      event.remaining -= deltaSeconds;
      if (event.remaining <= 0) {
        expired.push(event);
      }
    });

    expired.forEach((event) => {
      this.activeEvents = this.activeEvents.filter((e) => e !== event);
      switch (event.def.effect) {
        case 'storm_rain':
          delete this.state.modifiers.elementBonus.electric;
          delete this.state.modifiers.elementBonus.fire;
          break;
        case 'merchant':
          this.state.modifiers.costMul /= 0.8;
          break;
        case 'blessing':
          this.state.modifiers.damageMul /= 1.2;
          break;
        case 'mana_surge':
          this.state.modifiers.fireRateMul /= 1.2;
          break;
        case 'chill_breeze':
          this.state.modifiers.enemySpeedMul /= 0.85;
          break;
        case 'fog':
          this.state.modifiers.visibilityMul = 1;
          break;
        case 'meteor_shower':
          this.scene.stopMeteorShower();
          break;
        case 'crystal_bloom':
          this.scene.removeCrystalBloom();
          break;
      }
    });
  }
}
