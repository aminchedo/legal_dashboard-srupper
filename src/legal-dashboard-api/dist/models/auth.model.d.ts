export interface UserRecord {
    id: string;
    email: string;
    password_hash: string;
    role: 'user' | 'admin';
    created_at: string;
}
export interface AuthAuditRecord {
    id: string;
    user_id?: string | null;
    event: string;
    ip?: string | null;
    user_agent?: string | null;
    created_at: string;
}
