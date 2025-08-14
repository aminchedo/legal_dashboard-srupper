type ProxyEntry = string;
export declare class ResilientProxyRotator {
    private rotation;
    private index;
    private blacklist;
    private cooldownMs;
    constructor(proxies: ProxyEntry[], cooldownSeconds?: number);
    private rotate;
    getProxy(): ProxyEntry | null;
    blacklistProxy(proxy: ProxyEntry): void;
}
export {};
