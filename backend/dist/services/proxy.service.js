"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResilientProxyRotator = void 0;
const logger_1 = require("@utils/logger");
class ResilientProxyRotator {
    constructor(proxies, cooldownSeconds = 300) {
        this.index = 0;
        this.blacklist = new Map();
        this.rotation = [...proxies];
        this.cooldownMs = cooldownSeconds * 1000;
    }
    rotate() {
        if (this.rotation.length === 0)
            return null;
        this.index = (this.index + 1) % this.rotation.length;
        return this.rotation[this.index];
    }
    getProxy() {
        if (this.rotation.length === 0)
            return null;
        const start = this.index;
        let candidate = this.rotation[this.index];
        do {
            const until = this.blacklist.get(candidate);
            if (!until || until <= Date.now()) {
                if (until)
                    this.blacklist.delete(candidate);
                return candidate;
            }
            candidate = this.rotate() ?? candidate;
        } while (this.index !== start);
        return null;
    }
    blacklistProxy(proxy) {
        const until = Date.now() + this.cooldownMs;
        this.blacklist.set(proxy, until);
        logger_1.logger.warn(`Proxy blacklisted until ${new Date(until).toISOString()}: ${proxy}`);
    }
}
exports.ResilientProxyRotator = ResilientProxyRotator;
//# sourceMappingURL=proxy.service.js.map