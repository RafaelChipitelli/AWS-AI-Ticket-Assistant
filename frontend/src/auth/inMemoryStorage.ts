import type { KeyValueStorageInterface } from "aws-amplify/utils";

class InMemoryStorage implements KeyValueStorageInterface {
  private store = new Map<string, string>();

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export const inMemoryStorage = new InMemoryStorage();
