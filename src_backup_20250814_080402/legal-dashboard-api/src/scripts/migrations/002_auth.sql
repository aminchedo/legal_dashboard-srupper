-- Auth audit and refresh tokens
CREATE TABLE IF NOT EXISTS auth_audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    event TEXT NOT NULL,
    ip TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_log_user ON auth_audit_log (user_id);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens (user_id);