import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '@services/auth.service';
import { HttpError } from '@middleware/error.middleware';

export async function register(req: Request, res: Response) {
    const { email, password, name } = req.body as { email: string; password: string; name?: string };
    if (!email || !password) throw new HttpError(400, 'email and password are required');
    const result = await authService.register(email, password, name ?? null);
    return res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) throw new HttpError(400, 'email and password are required');
    const result = await authService.login(email, password);
    return res.json(result);
}

export async function refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) throw new HttpError(400, 'refreshToken is required');
    const tokens = await authService.refresh(refreshToken);
    return res.json(tokens);
}

export async function logout(req: Request, res: Response) {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) throw new HttpError(400, 'refreshToken is required');
    await authService.logout(refreshToken);
    return res.status(204).send();
}

export async function me(req: Request, res: Response) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) throw new HttpError(401, 'Unauthorized');
    const user = await authService.verify(token);
    return res.json(user);
}

export async function changePassword(req: Request, res: Response) {
    const { userId, oldPassword, newPassword } = req.body as {
        userId: string;
        oldPassword: string;
        newPassword: string;
    };
    if (!userId || !oldPassword || !newPassword) throw new HttpError(400, 'invalid payload');
    await authService.changePassword(userId, oldPassword, newPassword);
    return res.status(204).send();
}

export async function listUsers(_req: Request, res: Response) {
    const users = await authService.listUsers();
    return res.json(users);
}

export async function health(_req: Request, res: Response) {
    return res.json({ status: 'ok' });
}


