export declare const authService: {
    register(email: string, password: string, name: string | null): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: "user";
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: "user" | "admin";
        };
    }>;
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(token: string): Promise<void>;
    verify(accessToken: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: "user" | "admin";
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
    listUsers(): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: "user" | "admin";
    }[]>;
};
