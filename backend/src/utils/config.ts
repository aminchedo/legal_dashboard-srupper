export const config = {
    PORT: Number(process.env.PORT || 3000),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || './database/legal_documents.db',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5177',
    RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
    RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
    UPLOAD_MAX_SIZE: Number(process.env.UPLOAD_MAX_SIZE || 10485760),
    UPLOAD_DEST: process.env.UPLOAD_DEST || './uploads',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    CACHE_TTL: Number(process.env.CACHE_TTL || 3600),
    OCR_MODEL_PATH: process.env.OCR_MODEL_PATH || './models',
    SCRAPING_DELAY_MS: Number(process.env.SCRAPING_DELAY_MS || 1000),
    WEBSOCKET_PORT: Number(process.env.WEBSOCKET_PORT || 3001),
} as const;


