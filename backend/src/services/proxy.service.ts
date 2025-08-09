import { logger } from '@utils/logger';

type ProxyEntry = string;

export class ResilientProxyRotator {
    private rotation: ProxyEntry[];
    private index = 0;
    private blacklist: Map<ProxyEntry, number> = new Map();
    private cooldownMs: number;

    constructor(proxies: ProxyEntry[], cooldownSeconds = 300) {
        this.rotation = [...proxies];
        this.cooldownMs = cooldownSeconds * 1000;
    }

    private rotate(): ProxyEntry | null {
        if (this.rotation.length === 0) return null;
        this.index = (this.index + 1) % this.rotation.length;
        return this.rotation[this.index];
    }

    getProxy(): ProxyEntry | null {
        if (this.rotation.length === 0) return null;
        const start = this.index;
        let candidate = this.rotation[this.index];
        do {
            const until = this.blacklist.get(candidate);
            if (!until || until <= Date.now()) {
                if (until) this.blacklist.delete(candidate);
                return candidate;
            }
            candidate = this.rotate() ?? candidate;
        } while (this.index !== start);
        return null;
    }

    blacklistProxy(proxy: ProxyEntry): void {
        const until = Date.now() + this.cooldownMs;
        this.blacklist.set(proxy, until);
        logger.warn(`Proxy blacklisted until ${new Date(until).toISOString()}: ${proxy}`);
    }
}


