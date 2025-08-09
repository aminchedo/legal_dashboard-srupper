# syntax=docker/dockerfile:1

# Use a full Debian-based Node image for easier native builds (sharp, better-sqlite3)
FROM node:20-bullseye

# Create app directory
WORKDIR /app

# Install build tools for native modules (sqlite3, sharp, better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package.json package-lock.json* .npmrc* ./

# Install all deps but skip lifecycle scripts to avoid running postinstall/lint in container
# We keep dev deps because runtime uses tsconfig-paths and we need TypeScript to build
RUN npm ci --ignore-scripts

# Copy the rest of the source
COPY . .

# Build TypeScript directly to avoid prebuild lint step
RUN npx tsc && npx tsc-alias

# Hugging Face expects the app to listen on $PORT, default 7860
ENV PORT=7860 \
    NODE_ENV=production

# Expose the port for clarity (HF maps it automatically)
EXPOSE 7860

# Start the compiled app with path alias support
CMD ["node", "-r", "tsconfig-paths/register", "dist/app.js"]