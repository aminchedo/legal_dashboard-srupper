"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const error_middleware_1 = require("./error.middleware");
function requireAuth(req, _res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token)
        throw new error_middleware_1.HttpError(401, 'Unauthorized');
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        throw new error_middleware_1.HttpError(401, 'Invalid token');
    }
}
function requireAdmin(req, _res, next) {
    const user = req.user;
    if (!user)
        throw new error_middleware_1.HttpError(401, 'Unauthorized');
    if (user.role !== 'admin')
        throw new error_middleware_1.HttpError(403, 'Forbidden');
    next();
}
//# sourceMappingURL=auth.middleware.js.map