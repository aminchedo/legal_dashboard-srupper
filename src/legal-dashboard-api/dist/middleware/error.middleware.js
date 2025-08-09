"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
class HttpError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
exports.HttpError = HttpError;
function errorHandler(err, _req, res, _next) {
    if (err instanceof HttpError) {
        logger_1.logger.warn(`HTTP ${err.status}: ${err.message}`);
        return res.status(err.status).json({ error: err.message, details: err.details ?? null });
    }
    logger_1.logger.error('Unhandled error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
}
//# sourceMappingURL=error.middleware.js.map