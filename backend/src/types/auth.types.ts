export type UserRole = 'user' | 'admin';
export interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
}

export interface JwtTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'user';
}


