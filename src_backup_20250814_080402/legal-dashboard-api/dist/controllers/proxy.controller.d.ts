import { Request, Response } from 'express';
declare class ProxyController {
    testIntelligentConnection(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProxySettings(req: Request, res: Response): Promise<void>;
    updateProxySettings(req: Request, res: Response): Promise<void>;
    discoverFreeProxies(req: Request, res: Response): Promise<void>;
    private attemptDirectConnection;
    private autoDiscoverFreeProxies;
    private parseProxyList;
    private quickTestProxies;
    private testWithRotatingProxy;
    private updateIntelligentSettings;
    test(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const proxyController: ProxyController;
export {};
