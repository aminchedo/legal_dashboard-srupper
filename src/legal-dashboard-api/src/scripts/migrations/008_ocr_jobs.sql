-- OCR Jobs table
CREATE TABLE IF NOT EXISTS ocr_jobs (
    id TEXT PRIMARY KEY,
    file_path TEXT NOT NULL,
    language TEXT,
    status TEXT NOT NULL,
    result TEXT,
    confidence REAL,
    error TEXT,
    document_id TEXT,
    created_at TEXT NOT NULL,
    completed_at TEXT,
    created_by TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ocr_jobs_status ON ocr_jobs (status);

CREATE INDEX IF NOT EXISTS idx_ocr_jobs_document_id ON ocr_jobs (document_id);

CREATE INDEX IF NOT EXISTS idx_ocr_jobs_created_at ON ocr_jobs (created_at);

CREATE INDEX IF NOT EXISTS idx_ocr_jobs_file_path ON ocr_jobs (file_path);