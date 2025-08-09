"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
const error_middleware_1 = require("./middleware/error.middleware");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const config_1 = require("./utils/config");
const logger_1 = require("./utils/logger");
const websocket_controller_1 = require("./controllers/websocket.controller");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.config.CORS_ORIGIN,
        credentials: true
    }
});
exports.io = io;
(0, websocket_controller_1.attachSocket)(server);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: config_1.config.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json({ limit: config_1.config.UPLOAD_MAX_SIZE.toString() }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use('/api', rate_limit_middleware_1.apiRateLimiter);
app.set('io', io);
(0, routes_1.registerRoutes)(app);
app.use(error_middleware_1.errorHandler);
const port = config_1.config.PORT;
server.listen(port, () => {
    logger_1.logger.info(`API server running on port ${port}`);
    logger_1.logger.info(`Socket.IO server attached to HTTP server`);
});
//# sourceMappingURL=app.js.map