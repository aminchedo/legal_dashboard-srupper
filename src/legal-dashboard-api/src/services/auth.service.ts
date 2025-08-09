import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { config } from '@utils/config';
import { databaseService } from '@services/database.service';
import { authConfig } from '@config/auth.config';

function signTokens(user: { id: string; email: string; role: 'user' | 'admin' }) {
    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.JWT_SECRET as unknown as jwt.Secret, {
        expiresIn: config.JWT_EXPIRES_IN as unknown as jwt.SignOptions['expiresIn'],
    });
    const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, config.JWT_SECRET as unknown as jwt.Secret, {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN as unknown as jwt.SignOptions['expiresIn'],
    });
    const db = databaseService.getClient();
    db.run('INSERT INTO refresh_tokens (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)', [
        refreshToken,
        user.id,
        moment().toISOString(),
        moment().add(7, 'days').toISOString(),
    ]);
    return { accessToken, refreshToken };
}

export const authService = {
    async register(email: string, password: string, name: string | null) {
        const db = databaseService.getClient();
        const id = uuid();
        const passwordHash = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)', [
            id,
            email.toLowerCase(),
            name,
            passwordHash,
            'user',
            moment().toISOString(),
        ]);
        const tokens = signTokens({ id, email: email.toLowerCase(), role: 'user' });
        return { user: { id, email, name, role: 'user' as const }, ...tokens };
    },

    async login(email: string, password: string) {
        const db = databaseService.getClient();
        const rows = db.query<{ id: string; email: string; name: string | null; password_hash: string; role: 'user' | 'admin' }>(
            'SELECT id, email, name, password_hash, role FROM users WHERE email = ?',
            [email.toLowerCase()],
        );
        const user = rows[0];
        if (!user) throw new Error('Invalid credentials');

        // Lockout logic
        const lock = db.query<{ failed_attempts: number; lockout_until: number | null }>(
            'SELECT failed_attempts, lockout_until FROM user_lock WHERE user_id = ?',
            [user.id],
        )[0];
        const now = Date.now();
        if (lock?.lockout_until && lock.lockout_until > now) {
            throw new Error('Account locked. Try again later.');
        }

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            const attempts = (lock?.failed_attempts ?? 0) + 1;
            let until: number | null = null;
            if (attempts >= authConfig.lockoutThreshold) {
                until = now + authConfig.lockoutDurationMs;
            }
            if (lock) {
                db.run('UPDATE user_lock SET failed_attempts = ?, lockout_until = ? WHERE user_id = ?', [attempts, until, user.id]);
            } else {
                db.run('INSERT INTO user_lock (user_id, failed_attempts, lockout_until) VALUES (?, ?, ?)', [user.id, attempts, until]);
            }
            throw new Error('Invalid credentials');
        }

        // Reset lock on success
        db.run('UPDATE user_lock SET failed_attempts = 0, lockout_until = NULL WHERE user_id = ?', [user.id]);

        const tokens = signTokens({ id: user.id, email: user.email, role: user.role });
        return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
    },

    async refresh(token: string) {
        const db = databaseService.getClient();
        const rec = db.query<{ user_id: string }>('SELECT user_id FROM refresh_tokens WHERE token = ?', [token])[0];
        if (!rec) throw new Error('Invalid refresh token');
        const user = db.query<{ id: string; email: string; role: 'user' | 'admin' }>('SELECT id, email, role FROM users WHERE id = ?', [rec.user_id])[0];
        if (!user) throw new Error('User not found');
        return signTokens(user);
    },

    async logout(token: string) {
        const db = databaseService.getClient();
        db.run('DELETE FROM refresh_tokens WHERE token = ?', [token]);
    },

    async verify(accessToken: string) {
        const decoded = jwt.verify(accessToken, config.JWT_SECRET) as { sub: string; email: string; role: 'user' | 'admin' };
        const db = databaseService.getClient();
        const user = db.query<{ id: string; email: string; name: string | null; role: 'user' | 'admin' }>(
            'SELECT id, email, name, role FROM users WHERE id = ?',
            [decoded.sub],
        )[0];
        if (!user) throw new Error('User not found');
        return user;
    },

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const db = databaseService.getClient();
        const user = db.query<{ password_hash: string }>('SELECT password_hash FROM users WHERE id = ?', [userId])[0];
        if (!user) throw new Error('User not found');
        const ok = await bcrypt.compare(oldPassword, user.password_hash);
        if (!ok) throw new Error('Invalid old password');
        const newHash = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
    },

    async listUsers() {
        const db = databaseService.getClient();
        return db.query<{ id: string; email: string; name: string | null; role: 'user' | 'admin' }>(
            'SELECT id, email, name, role FROM users ORDER BY created_at DESC',
        );
    },
};


