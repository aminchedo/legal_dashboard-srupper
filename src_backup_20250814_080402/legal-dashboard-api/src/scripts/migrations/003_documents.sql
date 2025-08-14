-- Documents and versions
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    source TEXT,
    score REAL,
    created_at TEXT NOT NULL,
    updated_at TEXT
);

CREATE VIRTUAL
TABLE IF NOT EXISTS documents_fts USING fts5 (
    title,
    content,
    category,
    source,
    content = 'documents',
    content_rowid = 'id'
);

CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, title, content, category, source) VALUES (new.id, new.title, new.content, new.category, new.source);
END;

CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content, category, source) VALUES('delete', old.id, old.title, old.content, old.category, old.source);
END;

CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content, category, source) VALUES('delete', old.id, old.title, old.content, old.category, old.source);
  INSERT INTO documents_fts(rowid, title, content, category, source) VALUES (new.id, new.title, new.content, new.category, new.source);
END;

CREATE TABLE IF NOT EXISTS document_versions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
);