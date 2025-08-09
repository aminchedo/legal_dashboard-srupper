import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as authController from '@controllers/auth.controller';
import { authService } from '@services/auth.service';

jest.mock('@services/auth.service');

describe('Auth Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockAuthService: jest.Mocked<typeof authService>;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {}, headers: {} };
        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        mockAuthService = authService as jest.Mocked<typeof authService>;
    });

    test('register should return 201 with result', async () => {
        req.body = { email: 'a@b.com', password: 'pw', name: 'A' };
        mockAuthService.register.mockResolvedValueOnce({ id: 'u1', email: 'a@b.com' } as any);
        await authController.register(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 'u1', email: 'a@b.com' });
    });

    test('login should return tokens', async () => {
        req.body = { email: 'a@b.com', password: 'pw' };
        mockAuthService.login.mockResolvedValueOnce({ accessToken: 'at', refreshToken: 'rt' } as any);
        await authController.login(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith({ accessToken: 'at', refreshToken: 'rt' });
    });

    test('refreshToken should return new tokens', async () => {
        req.body = { refreshToken: 'rt' };
        mockAuthService.refresh.mockResolvedValueOnce({ accessToken: 'new', refreshToken: 'newrt' } as any);
        await authController.refreshToken(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith({ accessToken: 'new', refreshToken: 'newrt' });
    });

    test('logout should return 204', async () => {
        req.body = { refreshToken: 'rt' };
        mockAuthService.logout.mockResolvedValueOnce();
        await authController.logout(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});
