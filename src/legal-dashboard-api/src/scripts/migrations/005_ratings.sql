-- Ratings and history
CREATE TABLE IF NOT EXISTS ratings (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    score REAL NOT NULL,
    criteria TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rating_history (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    old_score REAL,
    new_score REAL,
    reason TEXT,
    created_at TEXT NOT NULL
);