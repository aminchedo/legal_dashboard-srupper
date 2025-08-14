-- Enrich scraping_sources with required fields for priority/category/status/url
-- Note: SQLite does not support IF NOT EXISTS for ADD COLUMN; run once after 009_enhanced_scraping.sql

-- Add url column to explicitly store provided URL alongside base_url
ALTER TABLE scraping_sources ADD COLUMN url TEXT;

-- Add category, priority, status
ALTER TABLE scraping_sources ADD COLUMN category TEXT;

ALTER TABLE scraping_sources ADD COLUMN priority INTEGER DEFAULT 2;

ALTER TABLE scraping_sources ADD COLUMN status TEXT DEFAULT 'active';

-- Optional index to list by priority first
CREATE INDEX IF NOT EXISTS idx_scraping_sources_priority ON scraping_sources (priority);