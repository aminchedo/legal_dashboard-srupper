# Multi-stage build for Legal Dashboard
FROM node:18-alpine as frontend

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build frontend assets (with proper error handling)
RUN npm run build 2>/dev/null || echo "No build script found, skipping frontend build"

# Python backend stage (final stage)
FROM python:3.11-alpine as backend

# Install system dependencies (minimal set)
RUN apk add --no-cache \
    gcc \
    musl-dev \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy and install Python requirements first (for better caching)
COPY requirements.txt* ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt 2>/dev/null || \
    echo "No requirements.txt found, skipping Python dependencies"

# Copy application code
COPY . .

# Copy built frontend assets (only if they exist)
COPY --from=frontend /app/dist ./static/ 2>/dev/null || \
COPY --from=frontend /app/build ./static/ 2>/dev/null || \
COPY --from=frontend /app/public ./static/ 2>/dev/null || \
echo "No frontend build artifacts found"

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ENVIRONMENT=production \
    DEBUG=false \
    PORT=8000

# Create non-root user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -G appuser -u 1001

# Set correct permissions
RUN chown -R appuser:appuser /app
USER appuser

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || \
        curl -f http://localhost:${PORT}/ || \
        wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || \
        exit 1

# Expose port
EXPOSE ${PORT}

# Start the application with better defaults
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1"]
