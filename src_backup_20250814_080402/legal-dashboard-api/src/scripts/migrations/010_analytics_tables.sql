-- Analytics tables
CREATE TABLE IF NOT EXISTS analytics_metrics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    value REAL NOT NULL,
    period TEXT NOT NULL,
    dimension TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_sentiments (
    document_id TEXT PRIMARY KEY,
    score REAL NOT NULL,
    confidence REAL NOT NULL,
    analyzed_at TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT NOT NULL,
    entity TEXT NOT NULL,
    type TEXT NOT NULL,
    count INTEGER NOT NULL,
    confidence REAL NOT NULL,
    analyzed_at TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_similarities (
    document1_id TEXT NOT NULL,
    document2_id TEXT NOT NULL,
    similarity REAL NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (document1_id, document2_id),
    FOREIGN KEY (document1_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (document2_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_categories (
    document_id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    confidence REAL NOT NULL,
    analyzed_at TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topic_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL,
    name TEXT NOT NULL,
    keywords TEXT NOT NULL, -- JSON array
    weight REAL NOT NULL,
    FOREIGN KEY (model_id) REFERENCES topic_models(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_topics (
    document_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    weight REAL NOT NULL,
    PRIMARY KEY (document_id, topic_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_period ON analytics_metrics(period);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_name ON analytics_metrics(name);
CREATE INDEX IF NOT EXISTS idx_document_entities_document_id ON document_entities(document_id);
CREATE INDEX IF NOT EXISTS idx_document_entities_type ON document_entities(type);
CREATE INDEX IF NOT EXISTS idx_document_topics_topic_id ON document_topics(topic_id);
