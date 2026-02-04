import { MapDef, Point } from '../data/maps';

export class PlacementSystem {
  private map: MapDef;
  private buildable: boolean[][];
  private occupied: boolean[][];
  private cooldownUntil: number[][];

  constructor(map: MapDef) {
    this.map = map;
    this.buildable = Array.from({ length: map.rows }, () =>
      Array.from({ length: map.cols }, () => true)
    );
    this.occupied = Array.from({ length: map.rows }, () =>
      Array.from({ length: map.cols }, () => false)
    );
    this.cooldownUntil = Array.from({ length: map.rows }, () =>
      Array.from({ length: map.cols }, () => 0)
    );

    const blockPoint = (p: Point) => {
      if (this.isInside(p.x, p.y)) this.buildable[p.y][p.x] = false;
    };

    map.paths.forEach((path) => path.forEach(blockPoint));
    map.blocked.forEach(blockPoint);
  }

  isInside(x: number, y: number): boolean {
    return x >= 0 && x < this.map.cols && y >= 0 && y < this.map.rows;
  }

  canPlace(x: number, y: number, time: number): boolean {
    if (!this.isInside(x, y)) return false;
    if (!this.buildable[y][x]) return false;
    if (this.occupied[y][x]) return false;
    if (time < this.cooldownUntil[y][x]) return false;
    return true;
  }

  occupy(x: number, y: number) {
    if (!this.isInside(x, y)) return;
    this.occupied[y][x] = true;
  }

  release(x: number, y: number, cooldownMs: number, time: number) {
    if (!this.isInside(x, y)) return;
    this.occupied[y][x] = false;
    this.cooldownUntil[y][x] = time + cooldownMs;
  }

  isBuildable(x: number, y: number): boolean {
    return this.isInside(x, y) && this.buildable[y][x];
  }
}
