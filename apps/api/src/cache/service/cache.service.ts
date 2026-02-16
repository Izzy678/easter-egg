import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  createdAt?: Date;
}

@Injectable()
export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    return entry.value;
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, {
      value,
      createdAt: new Date(),
    });
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }
}
