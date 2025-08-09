-- Enhanced scraping tables
CREATE TABLE IF NOT EXISTS scraping_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    selectors TEXT NOT NULL,  -- JSON containing CSS selectors
    headers TEXT,  -- JSON containing HTTP headers for requests
    created_at TEXT NOT NULL,
    updated_at TEXT
);

-- Drop existing table if needed
DROP TABLE IF EXISTS scraping_jobs;

-- Create enhanced scraping jobs table
CREATE TABLE IF NOT EXISTS scraping_jobs (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    source_id TEXT NOT NULL,
    status TEXT NOT NULL,
    progress INTEGER NOT NULL,
    result TEXT,  -- JSON containing scraping results
    error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    completed_at TEXT,
    created_by TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES scraping_sources(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_source_id ON scraping_jobs(source_id);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_created_at ON scraping_jobs(created_at);

-- Create table for document source relationships
CREATE TABLE IF NOT EXISTS document_source_relations (
    document_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    scrape_job_id TEXT,
    url TEXT,
    extracted_at TEXT NOT NULL,
    PRIMARY KEY (document_id, source_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES scraping_sources(id) ON DELETE CASCADE,
    FOREIGN KEY (scrape_job_id) REFERENCES scraping_jobs(id) ON DELETE SET NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_document_source_relations_source ON document_source_relations(source_id);
