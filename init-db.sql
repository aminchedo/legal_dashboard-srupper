-- Legal Dashboard Database Initialization Script
-- This script sets up the basic database structure

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create legal_documents table
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT,
    document_type VARCHAR(100),
    source_url VARCHAR(1000),
    domain VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create dashboard_statistics table
CREATE TABLE IF NOT EXISTS dashboard_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_items INTEGER DEFAULT 0,
    recent_items INTEGER DEFAULT 0,
    categories JSONB,
    avg_rating DECIMAL(3,3),
    success_rate DECIMAL(5,2),
    weekly_trend JSONB,
    monthly_growth DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    domain VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legal_documents_status ON legal_documents(status);
CREATE INDEX IF NOT EXISTS idx_legal_documents_created_at ON legal_documents(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_status ON activity_log(status);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample data
INSERT INTO dashboard_statistics (total_items, recent_items, categories, avg_rating, success_rate, weekly_trend, monthly_growth) 
VALUES (
    47582,
    1843,
    '{"Legal": 12450, "Economic": 8920, "Social": 7830, "Cultural": 6240, "Technical": 5100}',
    0.891,
    94.1,
    '[
        {"day": "Mon", "success": 231},
        {"day": "Tue", "success": 295},
        {"day": "Wed", "success": 374},
        {"day": "Thu", "success": 345},
        {"day": "Fri", "success": 396},
        {"day": "Sat", "success": 281},
        {"day": "Sun", "success": 150}
    ]',
    18.3
) ON CONFLICT DO NOTHING;

-- Insert sample activity data
INSERT INTO activity_log (title, domain, status, details) VALUES
    ('Labor Law - 2024 Amendment', 'dastour.ir', 'completed', '{"description": "Successfully processed labor law amendment"}'),
    ('E-Commerce Regulations Act', 'majles.ir', 'completed', '{"description": "E-commerce regulations updated"}'),
    ('Data Protection Directive', 'president.ir', 'processing', '{"description": "Data protection directive under review"}'),
    ('New Import/Export Tariffs', 'customs.ir', 'failed', '{"description": "Failed to process tariff updates"}'),
    ('National Cultural Development Plan', 'farhang.gov.ir', 'completed', '{"description": "Cultural development plan approved"}')
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON legal_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to the legal_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO legal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO legal_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO legal_user;