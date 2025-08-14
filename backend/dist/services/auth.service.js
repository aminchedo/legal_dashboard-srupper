"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const config_1 = require("@utils/config");
const database_service_1 = require("@services/database.service");
const auth_config_1 = require("@config/auth.config");
function signTokens(user) {
    const accessToken = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email, role: user.role }, config_1.config.JWT_SECRET, {
        expiresIn: config_1.config.JWT_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id, type: 'refresh' }, config_1.config.JWT_SECRET, {
        expiresIn: config_1.config.JWT_REFRESH_EXPIRES_IN,
    });
    const db = database_service_1.databaseService.getClient();
    db.run('INSERT INTO refresh_tokens (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)', [
        refreshToken,
        user.id,
        (0, moment_1.default)().toISOString(),
        (0, moment_1.default)().add(7, 'days').toISOString(),
    ]);
    return { accessToken, refreshToken };
}
exports.authService = {
    async register(email, password, name) {
        const db = database_service_1.databaseService.getClient();
        const id = (0, uuid_1.v4)();
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        db.run('INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)', [
            id,
            email.toLowerCase(),
            name,
            passwordHash,
            'user',
            (0, moment_1.default)().toISOString(),
        ]);
        const tokens = signTokens({ id, email: email.toLowerCase(), role: 'user' });
        return { user: { id, email, name, role: 'user' }, ...tokens };
    },
    async login(email, password) {
        const db = database_service_1.databaseService.getClient();
        const rows = db.query('SELECT id, email, name, password_hash, role FROM users WHERE email = ?', [email.toLowerCase()]);
        const user = rows[0];
        if (!user)
            throw new Error('Invalid credentials');
        const lock = db.query('SELECT failed_attempts, lockout_until FROM user_lock WHERE user_id = ?', [user.id])[0];
        const now = Date.now();
        if (lock?.lockout_until && lock.lockout_until > now) {
            throw new Error('Account locked. Try again later.');
        }
        const ok = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!ok) {
            const attempts = (lock?.failed_attempts ?? 0) + 1;
            let until = null;
            if (attempts >= auth_config_1.authConfig.lockoutThreshold) {
                until = now + auth_config_1.authConfig.lockoutDurationMs;
            }
            if (lock) {
                db.run('UPDATE user_lock SET failed_attempts = ?, lockout_until = ? WHERE user_id = ?', [attempts, until, user.id]);
            }
            else {
                db.run('INSERT INTO user_lock (user_id, failed_attempts, lockout_until) VALUES (?, ?, ?)', [user.id, attempts, until]);
            }
            throw new Error('Invalid credentials');
        }
        db.run('UPDATE user_lock SET failed_attempts = 0, lockout_until = NULL WHERE user_id = ?', [user.id]);
        const tokens = signTokens({ id: user.id, email: user.email, role: user.role });
        return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
    },
    async refresh(token) {
        const db = database_service_1.databaseService.getClient();
        const rec = db.query('SELECT user_id FROM refresh_tokens WHERE token = ?', [token])[0];
        if (!rec)
            throw new Error('Invalid refresh token');
        const user = db.query('SELECT id, email, role FROM users WHERE id = ?', [rec.user_id])[0];
        if (!user)
            throw new Error('User not found');
        return signTokens(user);
    },
    async logout(token) {
        const db = database_service_1.databaseService.getClient();
        db.run('DELETE FROM refresh_tokens WHERE token = ?', [token]);
    },
    async verify(accessToken) {
        const decoded = jsonwebtoken_1.default.verify(accessToken, config_1.config.JWT_SECRET);
        const db = database_service_1.databaseService.getClient();
        const user = db.query('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.sub])[0];
        if (!user)
            throw new Error('User not found');
        return user;
    },
    async changePassword(userId, oldPassword, newPassword) {
        const db = database_service_1.databaseService.getClient();
        const user = db.query('SELECT password_hash FROM users WHERE id = ?', [userId])[0];
        if (!user)
            throw new Error('User not found');
        const ok = await bcryptjs_1.default.compare(oldPassword, user.password_hash);
        if (!ok)
            throw new Error('Invalid old password');
        const newHash = await bcryptjs_1.default.hash(newPassword, 10);
        db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
    },
    async listUsers() {
        const db = database_service_1.databaseService.getClient();
        return db.query('SELECT id, email, name, role FROM users ORDER BY created_at DESC');
    },
};
//# sourceMappingURL=auth.service.js.map