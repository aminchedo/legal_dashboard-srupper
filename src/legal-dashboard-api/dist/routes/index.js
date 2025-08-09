"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const auth_routes_1 = __importDefault(require("./auth.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const documents_routes_1 = __importDefault(require("./documents.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const enhanced_analytics_routes_1 = __importDefault(require("./enhanced-analytics.routes"));
const ocr_routes_1 = __importDefault(require("./ocr.routes"));
const reports_routes_1 = __importDefault(require("./reports.routes"));
const scraping_routes_1 = __importDefault(require("./scraping.routes"));
const websocket_routes_1 = __importDefault(require("./websocket.routes"));
const rating_routes_1 = __importDefault(require("./rating.routes"));
const proxy_routes_1 = __importDefault(require("./proxy.routes"));
function registerRoutes(app) {
    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/dashboard', dashboard_routes_1.default);
    app.use('/api/documents', documents_routes_1.default);
    app.use('/api/analytics', analytics_routes_1.default);
    app.use('/api/enhanced-analytics', enhanced_analytics_routes_1.default);
    app.use('/api/ocr', ocr_routes_1.default);
    app.use('/api/reports', reports_routes_1.default);
    app.use('/api/scraping', scraping_routes_1.default);
    app.use('/api/ws', websocket_routes_1.default);
    app.use('/api/ratings', rating_routes_1.default);
    app.use('/api/proxy', proxy_routes_1.default);
}
//# sourceMappingURL=index.js.map