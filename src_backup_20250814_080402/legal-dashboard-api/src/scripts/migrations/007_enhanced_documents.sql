-- Enhanced Documents
-- Drop existing triggers
DROP TRIGGER IF EXISTS documents_ai;

DROP TRIGGER IF EXISTS documents_ad;

DROP TRIGGER IF EXISTS documents_au;

-- Drop existing FTS table
DROP TABLE IF EXISTS documents_fts;

-- Alter existing documents table
ALTER TABLE documents
ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';

ALTER TABLE documents ADD COLUMN language TEXT DEFAULT NULL;

ALTER TABLE documents ADD COLUMN keywords TEXT DEFAULT '[]';

ALTER TABLE documents ADD COLUMN metadata TEXT DEFAULT '{}';

ALTER TABLE documents ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE documents ADD COLUMN hash TEXT DEFAULT NULL;

ALTER TABLE documents ADD COLUMN published_at TEXT DEFAULT NULL;

ALTER TABLE documents ADD COLUMN archived_at TEXT DEFAULT NULL;

ALTER TABLE documents
ADD COLUMN created_by TEXT NOT NULL DEFAULT 'system';

ALTER TABLE documents ADD COLUMN updated_by TEXT DEFAULT NULL;

-- Drop existing document_versions table and recreate with enhanced structure
DROP TABLE IF EXISTS document_versions;

CREATE TABLE IF NOT EXISTS document_versions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT NOT NULL,
    hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    created_by TEXT NOT NULL,
    change_summary TEXT,
    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
);

-- Create index on document_versions
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions (document_id);

CREATE INDEX IF NOT EXISTS idx_document_versions_version ON document_versions (document_id, version);

-- Create enhanced FTS table
CREATE VIRTUAL
TABLE IF NOT EXISTS documents_fts USING fts5 (
    title,
    content,
    keywords,
    category,
    source,
    language,
    content = 'documents',
    content_rowid = 'id'
);

-- Create triggers for FTS synchronization
CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, title, content, keywords, category, source, language)
  VALUES (new.id, new.title, new.content, new.keywords, new.category, new.source, new.language);
END;

CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content, keywords, category, source, language)
  VALUES('delete', old.id, old.title, old.content, old.keywords, old.category, old.source, old.language);
END;

CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content, keywords, category, source, language)
  VALUES('delete', old.id, old.title, old.content, old.keywords, old.category, old.source, old.language);
  INSERT INTO documents_fts(rowid, title, content, keywords, category, source, language)
  VALUES (new.id, new.title, new.content, new.keywords, new.category, new.source, new.language);
END;

-- Create document tags table
CREATE TABLE IF NOT EXISTS document_tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TEXT NOT NULL
);

-- Create document_tag_relations table for many-to-many relationship
CREATE TABLE IF NOT EXISTS document_tag_relations (
    document_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    created_by TEXT NOT NULL,
    PRIMARY KEY (document_id, tag_id),
    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES document_tags (id) ON DELETE CASCADE
);

-- Create document ratings table
CREATE TABLE IF NOT EXISTS document_ratings (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    score REAL NOT NULL,
    feedback TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (document_id, user_id)
);

-- Create index on document ratings
CREATE INDEX IF NOT EXISTS idx_document_ratings_document_id ON document_ratings (document_id);

CREATE INDEX IF NOT EXISTS idx_document_ratings_user_id ON document_ratings (user_id);

-- Create function to calculate average rating
CREATE VIEW IF NOT EXISTS document_avg_ratings AS
SELECT
    document_id,
    COUNT(*) as rating_count,
    AVG(score) as avg_score
FROM document_ratings
GROUP BY
    document_id;

-- Create index on documents
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents (category);

CREATE INDEX IF NOT EXISTS idx_documents_source ON documents (source);

CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);

CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents (created_at);

CREATE INDEX IF NOT EXISTS idx_documents_language ON documents (language);

CREATE INDEX IF NOT EXISTS idx_documents_version ON documents (version);