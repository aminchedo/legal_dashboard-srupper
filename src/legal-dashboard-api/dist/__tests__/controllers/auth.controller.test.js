"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const authController = __importStar(require("../../controllers/auth.controller"));
const auth_service_1 = require("../../services/auth.service");
globals_1.jest.mock('@services/auth.service');
(0, globals_1.describe)('Auth Controller', () => {
    let req;
    let res;
    let mockAuthService;
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        req = { body: {}, headers: {} };
        res = {
            json: globals_1.jest.fn().mockReturnThis(),
            status: globals_1.jest.fn().mockReturnThis(),
            send: globals_1.jest.fn().mockReturnThis()
        };
        mockAuthService = auth_service_1.authService;
    });
    (0, globals_1.test)('register should return 201 with result', async () => {
        req.body = { email: 'a@b.com', password: 'pw', name: 'A' };
        mockAuthService.register.mockResolvedValueOnce({ id: 'u1', email: 'a@b.com' });
        await authController.register(req, res);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(201);
        (0, globals_1.expect)(res.json).toHaveBeenCalledWith({ id: 'u1', email: 'a@b.com' });
    });
    (0, globals_1.test)('login should return tokens', async () => {
        req.body = { email: 'a@b.com', password: 'pw' };
        mockAuthService.login.mockResolvedValueOnce({ accessToken: 'at', refreshToken: 'rt' });
        await authController.login(req, res);
        (0, globals_1.expect)(res.json).toHaveBeenCalledWith({ accessToken: 'at', refreshToken: 'rt' });
    });
    (0, globals_1.test)('refreshToken should return new tokens', async () => {
        req.body = { refreshToken: 'rt' };
        mockAuthService.refresh.mockResolvedValueOnce({ accessToken: 'new', refreshToken: 'newrt' });
        await authController.refreshToken(req, res);
        (0, globals_1.expect)(res.json).toHaveBeenCalledWith({ accessToken: 'new', refreshToken: 'newrt' });
    });
    (0, globals_1.test)('logout should return 204', async () => {
        req.body = { refreshToken: 'rt' };
        mockAuthService.logout.mockResolvedValueOnce();
        await authController.logout(req, res);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(204);
        (0, globals_1.expect)(res.send).toHaveBeenCalled();
    });
});
//# sourceMappingURL=auth.controller.test.js.map