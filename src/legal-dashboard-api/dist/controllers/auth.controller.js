"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.me = me;
exports.changePassword = changePassword;
exports.listUsers = listUsers;
exports.health = health;
const auth_service_1 = require("../services/auth.service");
const error_middleware_1 = require("../middleware/error.middleware");
async function register(req, res) {
    const { email, password, name } = req.body;
    if (!email || !password)
        throw new error_middleware_1.HttpError(400, 'email and password are required');
    const result = await auth_service_1.authService.register(email, password, name ?? null);
    return res.status(201).json(result);
}
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        throw new error_middleware_1.HttpError(400, 'email and password are required');
    const result = await auth_service_1.authService.login(email, password);
    return res.json(result);
}
async function refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
        throw new error_middleware_1.HttpError(400, 'refreshToken is required');
    const tokens = await auth_service_1.authService.refresh(refreshToken);
    return res.json(tokens);
}
async function logout(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
        throw new error_middleware_1.HttpError(400, 'refreshToken is required');
    await auth_service_1.authService.logout(refreshToken);
    return res.status(204).send();
}
async function me(req, res) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token)
        throw new error_middleware_1.HttpError(401, 'Unauthorized');
    const user = await auth_service_1.authService.verify(token);
    return res.json(user);
}
async function changePassword(req, res) {
    const { userId, oldPassword, newPassword } = req.body;
    if (!userId || !oldPassword || !newPassword)
        throw new error_middleware_1.HttpError(400, 'invalid payload');
    await auth_service_1.authService.changePassword(userId, oldPassword, newPassword);
    return res.status(204).send();
}
async function listUsers(_req, res) {
    const users = await auth_service_1.authService.listUsers();
    return res.json(users);
}
async function health(_req, res) {
    return res.json({ status: 'ok' });
}
//# sourceMappingURL=auth.controller.js.map