-- Scraping jobs and results
CREATE TABLE IF NOT EXISTS scraping_jobs (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS scraping_results (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    content TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_results_job ON scraping_results (job_id);