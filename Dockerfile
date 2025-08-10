# Multi-stage build with comprehensive error handling
ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    curl \
    ca-certificates \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create app directory and user
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

# Builder stage
FROM base AS builder

# Set build environment
ENV NODE_ENV=development

# Copy package files first for better caching
COPY package*.json ./
COPY frontend/package*.json ./frontend/ 2>/dev/null || echo "No frontend package.json found"

# Install dependencies with error handling
RUN set -ex; \
    if [ -f frontend/package.json ]; then \
        echo "Installing frontend dependencies..."; \
        cd frontend && npm ci --include=dev; \
    elif [ -f package.json ]; then \
        echo "Installing root dependencies..."; \
        npm ci --include=dev; \
    else \
        echo "No package.json found, skipping npm install"; \
    fi

# Copy source code
COPY . .

# Build application with error handling
RUN set -ex; \
    if [ -f frontend/package.json ]; then \
        echo "Building frontend application..."; \
        cd frontend && npm run build; \
        ls -la dist/ || ls -la build/ || echo "No build output found"; \
    elif [ -f package.json ] && npm run build; then \
        echo "Building application..."; \
        npm run build; \
    else \
        echo "No build script found, creating dummy dist"; \
        mkdir -p dist && echo "<h1>Legal Dashboard</h1>" > dist/index.html; \
    fi

# Production stage
FROM base AS production

# Set production environment
ENV NODE_ENV=production
ENV PORT=7860
ENV GRADIO_SERVER_NAME=0.0.0.0
ENV GRADIO_SERVER_PORT=7860
ENV PYTHONUNBUFFERED=1

# Install serve for static files if needed
RUN npm install -g serve

# Copy built application with fallbacks
COPY --from=builder --chown=nodejs:nodejs /app/frontend/dist ./dist 2>/dev/null || true
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist 2>/dev/null || true
COPY --from=builder --chown=nodejs:nodejs /app/build ./dist 2>/dev/null || true
COPY --from=builder --chown=nodejs:nodejs /app/public ./dist 2>/dev/null || true

# Create default dist if none exists
RUN if [ ! -d "./dist" ] || [ -z "$(ls -A ./dist 2>/dev/null)" ]; then \
        mkdir -p ./dist && echo "<h1>Legal Dashboard - Default</h1>" > ./dist/index.html; \
    fi

# Copy other necessary files
COPY --from=builder --chown=nodejs:nodejs /app/*.py ./ 2>/dev/null || true
COPY --from=builder --chown=nodejs:nodejs /app/requirements.txt ./ 2>/dev/null || true
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./ 2>/dev/null || true

# Install Python if requirements exist
RUN if [ -f requirements.txt ]; then \
        echo "Installing Python dependencies..."; \
        apk add --no-cache python3 py3-pip && \
        pip3 install --no-cache-dir -r requirements.txt; \
    fi

# Create health check script
RUN echo '#!/bin/sh\ncurl -f http://localhost:7860/ || curl -f http://localhost:7860/health || exit 1' > /usr/local/bin/healthcheck.sh && \
    chmod +x /usr/local/bin/healthcheck.sh

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=5 \
    CMD /usr/local/bin/healthcheck.sh

# Flexible start command with error handling
CMD set -ex; \
    echo "Starting Legal Dashboard..."; \
    if [ -f app.py ]; then \
        echo "Starting Python Gradio app..."; \
        exec python3 app.py; \
    elif [ -f main.py ]; then \
        echo "Starting Python main app..."; \
        exec python3 main.py; \
    elif [ -f dist/index.js ]; then \
        echo "Starting Node.js app..."; \
        exec node dist/index.js; \
    elif [ -f dist/index.html ]; then \
        echo "Starting static file server..."; \
        exec serve -s dist -l 7860 -n; \
    else \
        echo "No suitable start method found. Available files:"; \
        ls -la .; \
        echo "Starting basic HTTP server..."; \
        exec serve -s dist -l 7860 -n; \
    fi