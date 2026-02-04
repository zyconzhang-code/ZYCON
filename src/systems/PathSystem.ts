import Phaser from 'phaser';
import { MapDef, Point } from '../data/maps';

export class PathSystem {
  readonly map: MapDef;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly tileSize: number;
  private groundPaths: Phaser.Math.Vector2[][];
  private airPath: Phaser.Math.Vector2[];

  constructor(map: MapDef, offsetX: number, offsetY: number) {
    this.map = map;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.tileSize = map.tileSize;
    this.groundPaths = map.paths.map((path) => this.toWorldPath(path));
    this.airPath = this.toWorldPath(map.airPath);
  }

  getWorldPosition(point: Point): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      this.offsetX + point.x * this.tileSize + this.tileSize / 2,
      this.offsetY + point.y * this.tileSize + this.tileSize / 2
    );
  }

  private toWorldPath(path: Point[]): Phaser.Math.Vector2[] {
    return path.map((p) => this.getWorldPosition(p));
  }

  getRandomGroundPath(): Phaser.Math.Vector2[] {
    return Phaser.Utils.Array.GetRandom(this.groundPaths).map((p) => p.clone());
  }

  getAirPath(): Phaser.Math.Vector2[] {
    return this.airPath.map((p) => p.clone());
  }

  getGroundPaths(): Phaser.Math.Vector2[][] {
    return this.groundPaths.map((path) => path.map((p) => p.clone()));
  }
}
