import { Mutex } from "async-mutex";

class LockManager {
    private locks: Map<string, Mutex>;

    constructor() {
        this.locks = new Map();
    }

    private getOrCreateLock(key: string): Mutex {
        if (!this.locks.has(key)) {
            this.locks.set(key, new Mutex());
        }
        return this.locks.get(key)!;
    }

    async acquire(key: string): Promise<() => void> {
        const lock = this.getOrCreateLock(key);
        return lock.acquire();
    }
}

export const lockManager = new LockManager();
