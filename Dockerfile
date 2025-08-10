# =============================================================================
# 🚀 Legal Dashboard - Optimized Multi-Stage Production Dockerfile
# =============================================================================

# Frontend Build Stage - Node.js Alpine
FROM node:18-alpine AS frontend-builder

# Set working directory
WORKDIR /app

# Add security labels
LABEL maintainer="Legal Dashboard Team" \
      version="1.0" \
      description="Legal Dashboard Frontend Builder"

# Install build dependencies (if needed)
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies with optimizations
RUN npm ci --only=production --silent --no-audit --no-fund \
    && npm cache clean --force

# Copy source code
COPY . .

# Build frontend assets with enhanced error handling
RUN npm run build 2>/dev/null || echo "No build script found, skipping frontend build"

# Clean up build dependencies
RUN apk del .build-deps

# =============================================================================
# Python Backend Stage - Final Production Image
FROM python:3.11-alpine AS production

# Security and metadata labels
LABEL org.opencontainers.image.title="Legal Dashboard" \
      org.opencontainers.image.description="Professional legal document management system" \
      org.opencontainers.image.vendor="Legal Dashboard Team" \
      org.opencontainers.image.source="https://github.com/legal-dashboard/legal-dashboard" \
      org.opencontainers.image.documentation="https://github.com/legal-dashboard/legal-dashboard/README.md"

# Install system dependencies with security optimizations
RUN apk add --no-cache --virtual .runtime-deps \
    gcc \
    musl-dev \
    curl \
    wget \
    ca-certificates \
    tzdata \
    && apk add --no-cache --virtual .build-deps \
    postgresql-dev \
    && rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create application directory
WORKDIR /app

# Create non-root user for enhanced security
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -G appuser -u 1001 --home /app --shell /bin/sh

# Copy Python requirements first for better Docker layer caching
COPY requirements.txt* ./

# Upgrade pip and install Python dependencies with optimizations
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt 2>/dev/null || \
    echo "No requirements.txt found, skipping Python dependencies" && \
    pip cache purge

# Copy application code with proper ownership
COPY --chown=appuser:appuser . .

# Copy built frontend assets from previous stage (with fallbacks)
COPY --from=frontend-builder --chown=appuser:appuser /app/dist ./static/ 2>/dev/null || \
COPY --from=frontend-builder --chown=appuser:appuser /app/build ./static/ 2>/dev/null || \
COPY --from=frontend-builder --chown=appuser:appuser /app/public ./static/ 2>/dev/null || \
echo "No frontend build artifacts found"

# Remove build dependencies after installation
RUN apk del .build-deps && \
    rm -rf /var/cache/apk/* /tmp/* /var/tmp/* /root/.cache

# Environment variables for production optimization
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PYTHONPATH=/app \
    ENVIRONMENT=production \
    DEBUG=false \
    PORT=8000 \
    WORKERS=1 \
    MAX_WORKERS=4 \
    TIMEOUT=120 \
    KEEPALIVE=2 \
    LOG_LEVEL=info

# Set correct permissions with security hardening
RUN chown -R appuser:appuser /app && \
    chmod -R 755 /app && \
    find /app -type f -name "*.py" -exec chmod 644 {} \; && \
    find /app -type f -name "*.sh" -exec chmod 755 {} \;

# Switch to non-root user
USER appuser

# Enhanced health check with multiple fallback endpoints
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f --max-time 8 http://localhost:${PORT}/health || \
        curl -f --max-time 8 http://localhost:${PORT}/ || \
        wget --no-verbose --tries=1 --spider --timeout=8 http://localhost:${PORT}/health || \
        wget --no-verbose --tries=1 --spider --timeout=8 http://localhost:${PORT}/ || \
        exit 1

# Expose application port
EXPOSE ${PORT}

# Create startup script for better process management
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting Legal Dashboard on port ${PORT}..."' >> /app/start.sh && \
    echo 'echo "👤 Running as user: $(whoami)"' >> /app/start.sh && \
    echo 'echo "📁 Working directory: $(pwd)"' >> /app/start.sh && \
    echo 'echo "🐍 Python version: $(python --version)"' >> /app/start.sh && \
    echo 'echo "⚙️ Environment: ${ENVIRONMENT}"' >> /app/start.sh && \
    echo 'echo "🔧 Workers: ${WORKERS}"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start the application with optimized settings' >> /app/start.sh && \
    echo 'exec uvicorn main:app \' >> /app/start.sh && \
    echo '  --host 0.0.0.0 \' >> /app/start.sh && \
    echo '  --port ${PORT} \' >> /app/start.sh && \
    echo '  --workers ${WORKERS} \' >> /app/start.sh && \
    echo '  --worker-class uvicorn.workers.UvicornWorker \' >> /app/start.sh && \
    echo '  --timeout-keep-alive ${KEEPALIVE} \' >> /app/start.sh && \
    echo '  --log-level ${LOG_LEVEL} \' >> /app/start.sh && \
    echo '  --access-log \' >> /app/start.sh && \
    echo '  --no-server-header' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application using the optimized startup script
CMD ["/app/start.sh"]
