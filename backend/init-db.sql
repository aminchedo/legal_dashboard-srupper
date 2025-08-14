-- Legal Dashboard Database Initialization Script


-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create tables for legal dashboard
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

<
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    document_type VARCHAR(50),
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';


-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON legal_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_cases_updated_at BEFORE UPDATE ON legal_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_notes_updated_at BEFORE UPDATE ON case_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - change this in production!)
INSERT INTO users (username, email, password_hash, full_name, role) 
VALUES ('admin', 'admin@legal-dashboard.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2.', 'System Administrator', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample data for testing
INSERT INTO legal_cases (case_number, title, description, case_type, status, priority, client_name, court_name, filing_date) 
VALUES 
    ('CASE-2024-001', 'Smith vs. Johnson', 'Contract dispute regarding software development services', 'Civil', 'open', 'high', 'John Smith', 'Superior Court', '2024-01-15'),
    ('CASE-2024-002', 'Corporate Merger', 'Merger and acquisition documentation review', 'Corporate', 'open', 'medium', 'TechCorp Inc.', 'Business Court', '2024-01-20')
ON CONFLICT (case_number) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO legal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO legal_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO legal_user;

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM legal_cases WHERE status = 'open') as open_cases,
    (SELECT COUNT(*) FROM legal_cases WHERE status = 'closed') as closed_cases,
    (SELECT COUNT(*) FROM legal_documents) as total_documents,
    (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
    (SELECT COALESCE(SUM(hours), 0) FROM time_entries WHERE date >= CURRENT_DATE - INTERVAL '30 days') as hours_this_month,
    (SELECT COALESCE(SUM(amount), 0) FROM billing WHERE status = 'paid' AND paid_date >= CURRENT_DATE - INTERVAL '30 days') as revenue_this_month;

-- Grant access to the view
GRANT SELECT ON dashboard_stats TO legal_user;
