import Phaser from 'phaser';
import { MAP_MAP, MapDef, Point } from '../data/maps';
import { TOWERS, TowerDef, TOWER_MAP } from '../data/towers';
import { BALANCE } from '../data/balance';
import { ENEMY_MAP } from '../data/enemies';
import { ELEMENT_NAMES } from '../data/elements';
import { HUD } from '../ui/HUD';
import { SidePanel } from '../ui/SidePanel';
import { Tooltip } from '../ui/Tooltip';
import { CardSelect, CardOption } from '../ui/CardSelect';
import { FloatingText } from '../ui/FloatingText';
import { TimeScaleSystem } from '../systems/TimeScaleSystem';
import { AudioManager } from '../systems/AudioManager';
import { SaveSystem, SaveData } from '../systems/SaveSystem';
import { GameState, createDefaultModifiers } from '../systems/GameState';
import { PathSystem } from '../systems/PathSystem';
import { PlacementSystem } from '../systems/PlacementSystem';
import { WaveSystem, SpawnInstruction } from '../systems/WaveSystem';
import { RewardSystem } from '../systems/RewardSystem';
import { EventSystem } from '../systems/EventSystem';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import { Projectile } from '../entities/Projectile';

export class GameScene extends Phaser.Scene {
  private map!: MapDef;
  private pathSystem!: PathSystem;
  private placementSystem!: PlacementSystem;
  private timeScaleSystem!: TimeScaleSystem;
  private audioManager!: AudioManager;
  private saveData!: SaveData;
  private state!: GameState;

  private hud!: HUD;
  private sidePanel!: SidePanel;
  private tooltip!: Tooltip;
  private cardSelect!: CardSelect;

  private waveSystem!: WaveSystem;
  private rewardSystem!: RewardSystem;
  private eventSystem!: EventSystem;

  private towers: Tower[] = [];
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];

  private selectedTowerDef: TowerDef | null = null;
  private previewSprite?: Phaser.GameObjects.Image;
  private previewGraphics?: Phaser.GameObjects.Graphics;
  private previewTile?: Phaser.GameObjects.Rectangle;

  private mapOffsetX = 40;
  private mapOffsetY = 80;

  private waveCountdown = 6;
  private waitingForChoice = false;
  private waveActive = false;

  private meteorActive = false;
  private meteorTimer = 0;
  private rushGoldBonus = false;

  private selectedTower: Tower | null = null;
  private sellButton?: Phaser.GameObjects.Container;
  private skillButtonText?: Phaser.GameObjects.Text;
  private pauseButton?: Phaser.GameObjects.Text;
  private speedButtons: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('GameScene');
  }

  init(data: { mapId: string }) {
    this.map = MAP_MAP[data.mapId] || Object.values(MAP_MAP)[0];
  }

  create() {
    this.saveData = SaveSystem.load();
    this.state = {
      gold: BALANCE.startGold,
      lives: BALANCE.startLives,
      wave: 0,
      heroShards: this.saveData.heroShards || 0,
      unlockedTowers: new Set(this.saveData.unlockedTowers),
      unlockedHeroes: new Set<string>(),
      modifiers: createDefaultModifiers(),
      tempBuffs: [],
      items: { bomb: 0 },
      sellCooldownUntil: 0
    };

    this.pathSystem = new PathSystem(this.map, this.mapOffsetX, this.mapOffsetY);
    this.placementSystem = new PlacementSystem(this.map);
    this.timeScaleSystem = new TimeScaleSystem(this);
    this.audioManager = new AudioManager();
    this.rewardSystem = new RewardSystem();
    this.eventSystem = new EventSystem(this, this.state);
    this.waveSystem = new WaveSystem();

    this.drawMap();
    this.createUI();
    this.createInput();

    this.events.once('shutdown', () => {
      this.audioManager.stopMusic();
    });

    this.input.once('pointerdown', () => {
      this.audioManager.unlock();
      this.audioManager.resume();
      this.audioManager.setVolumes(
        this.saveData.settings.master,
        this.saveData.settings.music,
        this.saveData.settings.sfx
      );
      this.audioManager.playMusic(this.map.theme);
    });

    this.showTutorial();
  }

  update(_: number, delta: number) {
    const scaled = delta * this.timeScaleSystem.getScale();
    if (this.timeScaleSystem.isPaused() || this.waitingForChoice) {
      this.hud.update(
        this.state.gold,
        this.state.lives,
        this.state.wave,
        this.getEnemyCount(),
        this.waveActive ? 0 : this.waveCountdown,
        this.getSpeedLabel()
      );
      return;
    }

    this.eventSystem.update(scaled / 1000);
    this.updateWave(scaled);

    this.projectiles.forEach((projectile) => projectile.update(scaled, this.enemies));
    this.projectiles = this.projectiles.filter((proj) => {
      if (proj.alive) return true;
      proj.destroy();
      return false;
    });

    this.enemies.forEach((enemy) => {
      enemy.update(scaled, this.state.modifiers.enemySpeedMul, this.state.modifiers.visibilityMul);
    });

    this.handleEnemyAuras();
    this.cleanupEnemies();

    this.towers.forEach((tower) => {
      tower.update(scaled, this.enemies, this.projectiles, this.state);
    });

    this.updateMeteor(scaled);
    this.updateSkillButton();

    this.hud.update(
      this.state.gold,
      this.state.lives,
      this.state.wave,
      this.getEnemyCount(),
      this.waveActive ? 0 : this.waveCountdown,
      this.getSpeedLabel()
    );
    this.sidePanel.updateTowerAvailability(this.state.gold, this.state.modifiers.costMul);

    if (this.state.lives <= 0) {
      this.gameOver();
    }
  }

  private drawMap() {
    const groundKey = `ground_${this.map.theme}`;
    const { cols, rows, tileSize } = this.map;

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const tile = this.add.image(
          this.mapOffsetX + x * tileSize + tileSize / 2,
          this.mapOffsetY + y * tileSize + tileSize / 2,
          groundKey
        );
        tile.setAlpha(0.95);
      }
    }

    const pathCells = new Set<string>();
    this.map.paths.forEach((path) => {
      path.forEach((p) => pathCells.add(`${p.x},${p.y}`));
    });

    const pathGraphics = this.add.graphics();
    pathGraphics.fillStyle(0x0f141a, 0.55);
    pathCells.forEach((cell) => {
      const [x, y] = cell.split(',').map(Number);
      pathGraphics.fillRoundedRect(
        this.mapOffsetX + x * tileSize + 6,
        this.mapOffsetY + y * tileSize + 6,
        tileSize - 12,
        tileSize - 12,
        8
      );
    });

    this.map.decorations.forEach((decor) => {
      const pos = this.pathSystem.getWorldPosition({ x: decor.x, y: decor.y } as Point);
      const key = `decor_${decor.type}`;
      this.add.image(pos.x, pos.y, key).setScale(1.2).setDepth(3);
    });
  }

  private createUI() {
    const { width, height } = this.scale;
    this.hud = new HUD(this, width);
    this.tooltip = new Tooltip(this);
    this.cardSelect = new CardSelect(this, width, height);

    this.sidePanel = new SidePanel(this, width - 250, 60, 240, height - 80);
    this.sidePanel.setTowerList(this.getUnlockedTowers(false), (def) => this.selectTower(def));
    this.sidePanel.setHeroList(this.getUnlockedTowers(true), (def) => this.selectTower(def));
    this.sidePanel.setItemCount(this.state.items.bomb);
    this.sidePanel.onItemUse(() => this.useBomb());

    this.sidePanel.onVolumeChange(0, (value) => this.updateVolume(value, undefined, undefined));
    this.sidePanel.onVolumeChange(1, (value) => this.updateVolume(undefined, value, undefined));
    this.sidePanel.onVolumeChange(2, (value) => this.updateVolume(undefined, undefined, value));
    this.sidePanel.setVolumeValues(
      this.saveData.settings.master,
      this.saveData.settings.music,
      this.saveData.settings.sfx
    );

    this.createTopControls();
  }

  private createTopControls() {
    const { width } = this.scale;
    const baseX = width - 260;
    const baseY = 12;

    const pauseBg = this.add.rectangle(baseX, baseY, 70, 26, 0x1c232c, 0.9).setOrigin(0);
    this.pauseButton = this.add.text(baseX + 8, baseY + 4, '暂停', {
      fontSize: '14px',
      color: '#e7e3d5'
    });
    pauseBg.setScrollFactor(0).setDepth(1001);
    this.pauseButton.setScrollFactor(0).setDepth(1002);
    pauseBg.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.togglePause());
    this.pauseButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.togglePause());

    const speeds = [1, 2, 3];
    speeds.forEach((speed, index) => {
      const x = baseX + 80 + index * 50;
      const bg = this.add.rectangle(x, baseY, 42, 26, 0x1c232c, 0.9).setOrigin(0);
      const label = this.add.text(x + 8, baseY + 4, `${speed}x`, {
        fontSize: '14px',
        color: '#e7e3d5'
      });
      bg.setScrollFactor(0).setDepth(1001);
      label.setScrollFactor(0).setDepth(1002);
      bg.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.setSpeed(speed));
      label.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.setSpeed(speed));
      this.speedButtons.push(label);
    });

    this.updateSpeedButtons();
  }

  private createInput() {
    this.input.mouse?.disableContextMenu();
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.waitingForChoice) return;
      if (!this.selectedTowerDef) return;
      const { x, y, tileX, tileY } = this.getPointerTile(pointer);
      this.updatePlacementPreview(x, y, tileX, tileY);
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.waitingForChoice) return;
      if (pointer.rightButtonDown()) {
        this.cancelPlacement();
        return;
      }
      if (!this.selectedTowerDef) return;
      const { tileX, tileY, x, y } = this.getPointerTile(pointer);
      const canPlace = this.placementSystem.canPlace(tileX, tileY, this.time.now);
      if (!canPlace) return;

      const cost = Math.floor(this.selectedTowerDef.cost * this.state.modifiers.costMul);
      if (this.state.gold < cost) return;
      this.state.gold -= cost;
      const tower = new Tower(this, this.selectedTowerDef, x, y);
      tower.setInteractive({ useHandCursor: true });
      tower.on('pointerover', () => this.showTowerTooltip(tower));
      tower.on('pointerout', () => this.tooltip.hide());
      tower.on('pointerdown', () => this.selectPlacedTower(tower));

      this.towers.push(tower);
      this.add.existing(tower);
      this.placementSystem.occupy(tileX, tileY);
      this.audioManager.playSfx('place');
      this.cancelPlacement();
    });

    this.input.keyboard?.on('keydown-SPACE', () => this.togglePause());
    this.input.keyboard?.on('keydown-ONE', () => this.setSpeed(1));
    this.input.keyboard?.on('keydown-TWO', () => this.setSpeed(2));
    this.input.keyboard?.on('keydown-THREE', () => this.setSpeed(3));
    this.input.keyboard?.on('keydown-B', () => this.useBomb());
    this.input.keyboard?.on('keydown-R', () => {
      if (this.selectedTower) this.selectedTower.tryActivateSkill(this.state);
    });
  }

  private showTutorial() {
    this.hud.showBanner('教程：选择右侧怪物塔，左键放置，右键取消。', '#6ab7c9');
  }

  private updateWave(delta: number) {
    if (this.waveSystem.isSpawning()) {
      this.waveSystem.update(delta, (instruction) => this.spawnEnemy(instruction));
    }

    if (this.waveActive) {
      if (!this.waveSystem.isSpawning() && this.enemies.length === 0) {
        this.onWaveComplete();
      }
      return;
    }

    this.waveCountdown -= delta / 1000;
    if (this.waveCountdown <= 0) {
      this.startNextWave();
    }
  }

  private startNextWave() {
    const wave = this.state.wave + 1;
    this.state.wave = wave;

    if (wave % BALANCE.eventEvery === 0 && Math.random() < BALANCE.eventChance) {
      this.eventSystem.triggerRandomEvent();
    }

    if (wave <= BALANCE.tutorialWaves) {
      const hints = [
        '第1波：优先铺设基础塔，熟悉放置与射程。',
        '第2波：尝试不同元素，观察克制提示。',
        '第3波：留意金币与塔组合，为后续做准备。'
      ];
      this.hud.showBanner(hints[wave - 1], '#6ab7c9');
    }

    const rush = this.eventSystem.consumeRush();
    this.waveSystem.startWave(wave, rush);
    this.waveActive = true;
    this.waveCountdown = 0;
    this.rushGoldBonus = rush;
  }

  private onWaveComplete() {
    const rewardBase = BALANCE.baseWaveGold * Math.pow(BALANCE.goldGrowth, this.state.wave - 1);
    const reward = rewardBase * (this.rushGoldBonus ? 1.3 : 1);
    this.rushGoldBonus = false;
    this.state.gold += reward * this.state.modifiers.goldMul;
    this.audioManager.playSfx('reward');
    this.waveActive = false;
    this.waveCountdown = 6;
    this.sellButton?.destroy();
    this.selectedTower?.setSelected(false);
    this.selectedTower = null;

    const locked = this.getLockedTowerIds();
    this.waitingForChoice = true;
    const choices = this.rewardSystem.getChoices(locked.length);
    const cardOptions: CardOption[] = choices.map((option) => ({
      id: option.id,
      title: option.name,
      description: option.description
    }));

    this.cardSelect.show('波次奖励', cardOptions, (option) => {
      this.applyReward(option.id);
      if (this.state.wave % BALANCE.unlockEvery === 0) {
        this.showUnlockChoice();
      } else {
        this.waitingForChoice = false;
      }
    });
  }

  private applyReward(id: string) {
    switch (id) {
      case 'gold_small':
        this.state.gold += 60;
        break;
      case 'gold_large':
        this.state.gold += 120;
        break;
      case 'buff_damage':
        this.applyTempBuff('reward_damage', 10, () => (this.state.modifiers.damageMul /= 1.2));
        this.state.modifiers.damageMul *= 1.2;
        break;
      case 'buff_speed':
        this.applyTempBuff('reward_speed', 10, () => (this.state.modifiers.fireRateMul /= 1.2));
        this.state.modifiers.fireRateMul *= 1.2;
        break;
      case 'unlock_tower':
        this.unlockRandomTower();
        break;
      case 'hero_shard':
        this.state.heroShards += 1;
        this.hud.showBanner('获得英雄碎片 +1', '#c9b06a');
        this.saveProgress();
        break;
      case 'item_bomb':
        this.state.items.bomb += 1;
        this.sidePanel.setItemCount(this.state.items.bomb);
        break;
    }
  }

  private showUnlockChoice() {
    const options: CardOption[] = [];
    const locked = this.getLockedTowerIds();
    const heroLocked = this.getLockedHeroIds();

    if (locked.length > 0) {
      const towerId = Phaser.Utils.Array.GetRandom(locked) as string;
      const def = TOWER_MAP[towerId];
      options.push({
        id: `unlock_${def.id}`,
        title: `解锁 ${def.name}`,
        description: def.description
      });
    }

    if (heroLocked.length > 0) {
      const heroId = Phaser.Utils.Array.GetRandom(heroLocked) as string;
      const def = TOWER_MAP[heroId];
      options.push({
        id: `unlock_${def.id}`,
        title: `英雄解锁 ${def.name}`,
        description: def.description
      });
    }

    options.push({
      id: 'upgrade_damage',
      title: '守护强化',
      description: '全塔伤害永久 +10%。'
    });
    options.push({
      id: 'upgrade_speed',
      title: '迅捷强化',
      description: '全塔攻速永久 +10%。'
    });
    options.push({
      id: 'upgrade_gold',
      title: '后勤强化',
      description: '金币收益永久 +10%。'
    });

    const finalOptions = Phaser.Utils.Array.Shuffle(options).slice(0, 3);

    this.cardSelect.show('20 波解锁', finalOptions, (option) => {
      if (option.id.startsWith('unlock_')) {
        const towerId = option.id.replace('unlock_', '');
        this.state.unlockedTowers.add(towerId);
      } else if (option.id === 'upgrade_damage') {
        this.state.modifiers.damageMul *= 1.1;
      } else if (option.id === 'upgrade_speed') {
        this.state.modifiers.fireRateMul *= 1.1;
      } else if (option.id === 'upgrade_gold') {
        this.state.modifiers.goldMul *= 1.1;
      }
      this.refreshSidePanel();
      this.saveProgress();
      this.waitingForChoice = false;
    });
  }

  private unlockRandomTower() {
    const locked = this.getLockedTowerIds();
    if (locked.length === 0) return;
    const towerId = Phaser.Utils.Array.GetRandom(locked) as string;
    this.state.unlockedTowers.add(towerId);
    this.refreshSidePanel();
    this.hud.showBanner(`解锁新塔：${TOWER_MAP[towerId].name}`, '#c9b06a');
    this.saveProgress();
  }

  private refreshSidePanel() {
    this.sidePanel.setTowerList(this.getUnlockedTowers(false), (def) => this.selectTower(def));
    this.sidePanel.setHeroList(this.getUnlockedTowers(true), (def) => this.selectTower(def));
  }

  private spawnEnemy(instruction: SpawnInstruction) {
    const waveScale = Math.pow(BALANCE.enemyHpGrowth, this.state.wave - 1) * this.state.modifiers.enemyHpMul;
    const isBoss = instruction.isBoss;
    const hpScale = isBoss ? waveScale * BALANCE.bossHpGrowth : waveScale;
    const path = instruction.isFlying ? this.pathSystem.getAirPath() : this.pathSystem.getRandomGroundPath();
    const enemy = new Enemy(this, instruction.def, path, instruction.isFlying, hpScale);
    enemy.setInteractive({ useHandCursor: true });
    enemy.on('pointerover', () => this.showEnemyTooltip(enemy));
    enemy.on('pointerout', () => this.tooltip.hide());

    this.enemies.push(enemy);
    this.add.existing(enemy);
    if (instruction.def.traits.includes('boss')) {
      this.audioManager.playSfx('boss');
      this.hud.showBanner('Boss 出现！', '#d65a5a');
    } else if (instruction.def.traits.includes('mini_boss')) {
      this.audioManager.playSfx('boss');
      this.hud.showBanner('小Boss 出现！', '#c9b06a');
    }
  }

  private cleanupEnemies() {
    const survivors: Enemy[] = [];
    this.enemies.forEach((enemy) => {
      if (enemy.dead) {
        this.onEnemyKilled(enemy);
        enemy.destroy();
        return;
      }
      if (enemy.isAtEnd()) {
        this.onEnemyEscape(enemy);
        enemy.destroy();
        return;
      }
      survivors.push(enemy);
    });
    this.enemies = survivors;
  }

  private onEnemyKilled(enemy: Enemy) {
    this.state.gold += enemy.def.reward * this.state.modifiers.goldMul;
    this.audioManager.playSfx('death');
    FloatingText.spawn(this, enemy.x, enemy.y, `+${enemy.def.reward}`, '#c9b06a');

    if (enemy.def.traits.includes('split')) {
      for (let i = 0; i < 2; i += 1) {
        const def = ENEMY_MAP.swarm;
        const path = enemy.isFlying ? this.pathSystem.getAirPath() : this.pathSystem.getRandomGroundPath();
        const spawned = new Enemy(this, def, path, enemy.isFlying, 0.6);
        spawned.x = enemy.x + Phaser.Math.Between(-8, 8);
        spawned.y = enemy.y + Phaser.Math.Between(-8, 8);
        this.enemies.push(spawned);
        this.add.existing(spawned);
      }
    }
  }

  private onEnemyEscape(enemy: Enemy) {
    this.state.lives -= 1;
    this.audioManager.playSfx('hit');
    FloatingText.spawn(this, enemy.x, enemy.y, '-1 生命', '#d65a5a');
  }

  private handleEnemyAuras() {
    this.enemies.forEach((enemy) => (enemy.auraBonus = 0));
    const auraSources = this.enemies.filter((enemy) => enemy.def.traits.includes('haste_aura'));
    auraSources.forEach((source) => {
      this.enemies.forEach((enemy) => {
        if (enemy === source) return;
        const dist = Phaser.Math.Distance.Between(source.x, source.y, enemy.x, enemy.y);
        if (dist <= 120) enemy.auraBonus = Math.max(enemy.auraBonus, 0.2);
      });
    });
  }

  private getPointerTile(pointer: Phaser.Input.Pointer) {
    const x = Phaser.Math.Snap.To(pointer.worldX - this.mapOffsetX, this.map.tileSize) + this.mapOffsetX + this.map.tileSize / 2;
    const y = Phaser.Math.Snap.To(pointer.worldY - this.mapOffsetY, this.map.tileSize) + this.mapOffsetY + this.map.tileSize / 2;
    const tileX = Math.floor((x - this.mapOffsetX) / this.map.tileSize);
    const tileY = Math.floor((y - this.mapOffsetY) / this.map.tileSize);
    return { x, y, tileX, tileY };
  }

  private updatePlacementPreview(x: number, y: number, tileX: number, tileY: number) {
    const canPlace = this.placementSystem.canPlace(tileX, tileY, this.time.now);

    if (!this.previewSprite && this.selectedTowerDef) {
      this.previewSprite = this.add.image(x, y, this.selectedTowerDef.spriteKey).setAlpha(0.7);
      this.previewSprite.setDepth(20);
    }
    if (this.previewSprite) {
      this.previewSprite.setPosition(x, y);
      this.previewSprite.setTint(canPlace ? 0x58c27d : 0xd65a5a);
    }

    if (!this.previewTile) {
      this.previewTile = this.add.rectangle(x, y, this.map.tileSize - 6, this.map.tileSize - 6, 0x58c27d, 0.15);
      this.previewTile.setStrokeStyle(2, 0x58c27d, 0.7);
      this.previewTile.setDepth(18);
    }
    this.previewTile.setPosition(x, y);
    this.previewTile.setStrokeStyle(2, canPlace ? 0x58c27d : 0xd65a5a, 0.7);

    if (!this.previewGraphics) {
      this.previewGraphics = this.add.graphics();
      this.previewGraphics.setDepth(15);
    }
    this.previewGraphics.clear();
    if (this.selectedTowerDef) {
      this.drawRangePreview(this.selectedTowerDef, x, y, canPlace);
    }
  }

  private drawRangePreview(def: TowerDef, x: number, y: number, ok: boolean) {
    if (!this.previewGraphics) return;
    const color = ok ? 0x58c27d : 0xd65a5a;
    this.previewGraphics.lineStyle(2, color, 0.6);
    this.previewGraphics.fillStyle(color, 0.08);
    const range = def.range;

    switch (def.rangeShape) {
      case 'circle':
        this.previewGraphics.strokeCircle(x, y, range);
        this.previewGraphics.fillCircle(x, y, range);
        break;
      case 'line':
        this.previewGraphics.strokeRect(x + range * 0.1, y - 12, range, 24);
        this.previewGraphics.fillRect(x + range * 0.1, y - 12, range, 24);
        break;
      case 'cone':
        this.previewGraphics.beginPath();
        this.previewGraphics.moveTo(x, y);
        this.previewGraphics.arc(x, y, range, Phaser.Math.DegToRad(-25), Phaser.Math.DegToRad(25));
        this.previewGraphics.closePath();
        this.previewGraphics.fillPath();
        this.previewGraphics.strokePath();
        break;
      case 'ring':
        this.previewGraphics.strokeCircle(x, y, def.aoeRadius || 70);
        this.previewGraphics.fillCircle(x, y, def.aoeRadius || 70);
        break;
    }
  }

  private cancelPlacement() {
    this.selectedTowerDef = null;
    this.previewSprite?.destroy();
    this.previewSprite = undefined;
    this.previewGraphics?.destroy();
    this.previewGraphics = undefined;
    this.previewTile?.destroy();
    this.previewTile = undefined;
    this.sidePanel.clearSelection();
  }

  private selectTower(def: TowerDef) {
    this.selectedTowerDef = def;
    this.sidePanel.setSelectedTower(def.id);
  }

  private selectPlacedTower(tower: Tower) {
    if (this.selectedTower && this.selectedTower !== tower) {
      this.selectedTower.setSelected(false);
    }
    this.selectedTower = tower;
    tower.setSelected(true);
    this.showSellButton(tower);
  }

  private showSellButton(tower: Tower) {
    this.sellButton?.destroy();
    this.skillButtonText = undefined;
    const refund = Math.floor(tower.def.cost * BALANCE.sellRefund);
    const isHero = tower.def.isHero;

    const bg = this.add.rectangle(tower.x + 30, tower.y - 40, isHero ? 160 : 90, 28, 0x141b22, 0.9).setOrigin(0);
    const sellText = this.add.text(tower.x + 36, tower.y - 36, `卖出 ${refund}`, {
      fontSize: '12px',
      color: '#c9b06a'
    });

    const items: Phaser.GameObjects.GameObject[] = [bg, sellText];

    if (isHero) {
      const skillBg = this.add.rectangle(tower.x + 122, tower.y - 40, 64, 28, 0x1f2630, 0.9).setOrigin(0);
      this.skillButtonText = this.add.text(tower.x + 128, tower.y - 36, '技能', {
        fontSize: '12px',
        color: '#6ab7c9'
      });
      items.push(skillBg, this.skillButtonText);
    }

    const container = this.add.container(0, 0, items);
    container.setDepth(1002);
    container.setInteractive(
      new Phaser.Geom.Rectangle(tower.x + 30, tower.y - 40, isHero ? 160 : 90, 28),
      Phaser.Geom.Rectangle.Contains
    );
    container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (isHero && pointer.worldX > tower.x + 110) {
        tower.tryActivateSkill(this.state);
        return;
      }
      this.sellTower(tower);
    });
    this.sellButton = container;
  }

  private updateSkillButton() {
    if (!this.selectedTower || !this.selectedTower.def.isHero || !this.skillButtonText) return;
    const cd = Math.max(0, this.selectedTower.skillCooldown);
    this.skillButtonText.setText(cd > 0 ? `冷却 ${cd.toFixed(0)}` : '技能');
  }

  private sellTower(tower: Tower) {
    if (this.time.now < this.state.sellCooldownUntil) {
      this.hud.showBanner('回收冷却中', '#d65a5a');
      return;
    }
    const refund = Math.floor(tower.def.cost * BALANCE.sellRefund);
    this.state.gold += refund;
    const tileX = Math.floor((tower.x - this.mapOffsetX) / this.map.tileSize);
    const tileY = Math.floor((tower.y - this.mapOffsetY) / this.map.tileSize);
    this.placementSystem.release(tileX, tileY, BALANCE.sellCooldownMs, this.time.now);
    this.state.sellCooldownUntil = this.time.now + 800;
    this.audioManager.playSfx('sell');
    this.towers = this.towers.filter((t) => t !== tower);
    tower.destroy();
    this.sellButton?.destroy();
    this.selectedTower = null;
  }

  private showTowerTooltip(tower: Tower) {
    const def = tower.def;
    const dps = def.damage * def.fireRate;
    const text = `${def.name}\n元素: ${def.elements.map((el) => ELEMENT_NAMES[el]).join('/')}\nDPS: ${dps.toFixed(
      1
    )}\n射程: ${def.range}\n特性: ${def.passive || def.description}`;
    this.tooltip.show(text, tower.x + 20, tower.y - 10);
  }

  private showEnemyTooltip(enemy: Enemy) {
    const def = enemy.def;
    const text = `${def.name}\n元素: ${def.elements.map((el) => ELEMENT_NAMES[el]).join('/')}\n生命: ${Math.ceil(enemy.hp)}/${Math.ceil(enemy.maxHp)}\n速度: ${def.speed}\n特性: ${def.traits.join(',')}`;
    this.tooltip.show(text, enemy.x + 20, enemy.y - 10);
  }

  private togglePause() {
    this.timeScaleSystem.togglePause();
    if (this.pauseButton) {
      this.pauseButton.setText(this.timeScaleSystem.isPaused() ? '继续' : '暂停');
    }
  }

  private setSpeed(speed: number) {
    this.timeScaleSystem.setSpeed(speed);
    this.updateSpeedButtons();
  }

  private updateSpeedButtons() {
    const current = this.timeScaleSystem.getSpeed();
    this.speedButtons.forEach((btn) => {
      const isActive = btn.text.includes(`${current}x`);
      btn.setColor(isActive ? '#c9b06a' : '#e7e3d5');
    });
  }

  private getSpeedLabel() {
    return this.timeScaleSystem.isPaused() ? '暂停' : `${this.timeScaleSystem.getSpeed()}x`;
  }

  private getEnemyCount() {
    return this.enemies.length + this.waveSystem.getQueueCount();
  }

  private applyTempBuff(id: string, duration: number, onExpire: () => void) {
    const expiresAt = this.time.now + duration * 1000;
    this.state.tempBuffs.push({ id, expiresAt, onExpire });
    this.time.delayedCall(duration * 1000, () => {
      onExpire();
      this.state.tempBuffs = this.state.tempBuffs.filter((buff) => buff.id !== id);
    });
  }

  private getUnlockedTowers(hero: boolean): TowerDef[] {
    return TOWERS.filter((tower) => {
      if (tower.isHero !== hero) return false;
      return this.state.unlockedTowers.has(tower.id);
    });
  }

  private getLockedTowerIds(): string[] {
    return TOWERS.filter((tower) => !tower.isHero)
      .map((tower) => tower.id)
      .filter((id) => !this.state.unlockedTowers.has(id));
  }

  private getLockedHeroIds(): string[] {
    return TOWERS.filter((tower) => tower.isHero)
      .map((tower) => tower.id)
      .filter((id) => !this.state.unlockedTowers.has(id));
  }

  private updateMeteor(delta: number) {
    if (!this.meteorActive) return;
    this.meteorTimer -= delta / 1000;
    if (this.meteorTimer > 0) return;
    this.meteorTimer = 0.6;

    const paths = this.pathSystem.getGroundPaths();
    const path = Phaser.Utils.Array.GetRandom(paths);
    const point = Phaser.Utils.Array.GetRandom(path);
    this.spawnMeteor(point.x, point.y);
  }

  private spawnMeteor(x: number, y: number) {
    const meteor = this.add.circle(x, y - 60, 8, 0xd65a5a, 1).setDepth(50);
    this.tweens.add({
      targets: meteor,
      y: y,
      duration: 240,
      onComplete: () => {
        meteor.destroy();
        this.enemies.forEach((enemy) => {
          const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (dist <= 80) {
            enemy.takeDamage(30, 'fire');
          }
        });
        this.towers.forEach((tower) => {
          const dist = Phaser.Math.Distance.Between(x, y, tower.x, tower.y);
          if (dist <= 60) {
            tower.applyRangeBuff(0.9, 6);
          }
        });
      }
    });
  }

  startMeteorShower(duration: number) {
    this.meteorActive = true;
    this.meteorTimer = 0.3;
    this.time.delayedCall(duration * 1000, () => this.stopMeteorShower());
  }

  stopMeteorShower() {
    this.meteorActive = false;
  }

  applyCrystalBloom(duration: number) {
    const towers = Phaser.Utils.Array.Shuffle([...this.towers]).slice(0, 3);
    towers.forEach((tower) => tower.applyRangeBuff(1.25, duration));
  }

  removeCrystalBloom() {
    // buffs are timed per tower
  }

  addLives(amount: number) {
    this.state.lives += amount;
    this.hud.showBanner(`生命 +${amount}`, '#58c27d');
  }

  showEventBanner(def: { name: string; description: string; duration: number }) {
    this.hud.showBanner(`${def.name}：${def.description} (${def.duration}s)`, '#6ab7c9');
  }

  playEventSfx() {
    this.audioManager.playSfx('event');
  }

  executeHeroSkill(tower: Tower) {
    const skill = tower.def.activeSkill;
    if (!skill) return;
    switch (skill.effect) {
      case 'quake':
        this.enemies.forEach((enemy) => {
          if (!enemy.isFlying) {
            enemy.takeDamage(40, tower.def.elements[0]);
            enemy.applyStatus('slow', 0.25, 3);
          }
        });
        this.spawnRing(tower.x, tower.y, 200);
        break;
      case 'tidal':
        this.enemies.forEach((enemy) => {
          const dist = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
          if (dist <= 260) {
            enemy.takeDamage(36, tower.def.elements[0]);
            enemy.pushBack(40);
          }
        });
        this.spawnCone(tower.x, tower.y, Phaser.Math.DegToRad(0), 260);
        break;
      case 'storm':
        for (let i = 0; i < 6; i += 1) {
          const point = Phaser.Utils.Array.GetRandom(this.pathSystem.getAirPath());
          this.spawnMeteor(point.x + Phaser.Math.Between(-80, 80), point.y + Phaser.Math.Between(-40, 40));
        }
        break;
    }
    this.hud.showBanner(`${skill.name} 释放！`, '#c9b06a');
  }

  spawnBeam(x1: number, y1: number, x2: number, y2: number) {
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xc9b06a, 0.6);
    graphics.lineBetween(x1, y1, x2, y2);
    graphics.setDepth(20);
    this.time.delayedCall(80, () => graphics.destroy());
  }

  spawnChain(x1: number, y1: number, x2: number, y2: number, start: boolean) {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, start ? 0xe3c13a : 0x6ab7c9, 0.7);
    graphics.lineBetween(x1, y1, x2, y2);
    graphics.setDepth(20);
    this.time.delayedCall(120, () => graphics.destroy());
  }

  spawnCone(x: number, y: number, angle: number, radius: number) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x8ad6c4, 0.18);
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.arc(x, y, radius, angle - 0.5, angle + 0.5, false);
    graphics.closePath();
    graphics.fillPath();
    graphics.setDepth(19);
    this.time.delayedCall(220, () => graphics.destroy());
  }

  spawnRing(x: number, y: number, radius: number) {
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xb68c5a, 0.7);
    graphics.strokeCircle(x, y, radius);
    graphics.setDepth(19);
    this.time.delayedCall(200, () => graphics.destroy());
  }

  spawnDamageTag(x: number, y: number, tag: 'super' | 'resist' | 'immune') {
    const text = tag === 'super' ? 'Super!' : tag === 'resist' ? 'Resist' : 'Immune';
    const color = tag === 'super' ? '#58c27d' : tag === 'resist' ? '#6ab7c9' : '#d65a5a';
    FloatingText.spawn(this, x, y, text, color);
  }

  useBomb() {
    if (this.state.items.bomb <= 0) return;
    this.state.items.bomb -= 1;
    this.sidePanel.setItemCount(this.state.items.bomb);
    this.enemies.forEach((enemy) => enemy.takeDamage(45, 'fire'));
    this.hud.showBanner('炸弹爆破！', '#d65a5a');
  }

  updateVolume(master?: number, music?: number, sfx?: number) {
    const values = this.sidePanel.getVolumeValues();
    const newMaster = master ?? values[0];
    const newMusic = music ?? values[1];
    const newSfx = sfx ?? values[2];

    this.audioManager.setVolumes(newMaster, newMusic, newSfx);
    this.saveData.settings.master = newMaster;
    this.saveData.settings.music = newMusic;
    this.saveData.settings.sfx = newSfx;
    SaveSystem.save({
      ...this.saveData,
      unlockedTowers: Array.from(this.state.unlockedTowers),
      heroShards: this.state.heroShards,
      bestWave: Math.max(this.saveData.bestWave, this.state.wave)
    });
  }

  private saveProgress() {
    SaveSystem.save({
      ...this.saveData,
      unlockedTowers: Array.from(this.state.unlockedTowers),
      heroShards: this.state.heroShards,
      bestWave: Math.max(this.saveData.bestWave, this.state.wave)
    });
  }

  private gameOver() {
    this.hud.showBanner('城门沦陷，游戏结束', '#d65a5a');
    this.timeScaleSystem.setPause(true);
    SaveSystem.save({
      ...this.saveData,
      unlockedTowers: Array.from(this.state.unlockedTowers),
      heroShards: this.state.heroShards,
      bestWave: Math.max(this.saveData.bestWave, this.state.wave)
    });
  }
}
