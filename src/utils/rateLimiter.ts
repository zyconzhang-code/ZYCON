import { setTimeout as delay } from "node:timers/promises";

export class DomainRateLimiter {
  private readonly minIntervalMs: number;
  private readonly chains = new Map<string, Promise<void>>();
  private readonly lastTimes = new Map<string, number>();

  constructor(minIntervalMs: number) {
    this.minIntervalMs = minIntervalMs;
  }

  async schedule<T>(domain: string, fn: () => Promise<T>) {
    const key = domain || "_default";
    const previous = this.chains.get(key) ?? Promise.resolve();
    let release: () => void;
    const next = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.chains.set(key, previous.then(() => next));

    await previous;
    const lastTime = this.lastTimes.get(key) ?? 0;
    const wait = Math.max(0, lastTime + this.minIntervalMs - Date.now());
    if (wait > 0) {
      await delay(wait);
    }
    this.lastTimes.set(key, Date.now());

    try {
      return await fn();
    } finally {
      release!();
    }
  }
}
