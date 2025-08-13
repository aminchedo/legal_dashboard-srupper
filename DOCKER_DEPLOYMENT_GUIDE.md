# 🚀 Legal Dashboard Docker Deployment Guide

This guide provides complete instructions for deploying your Legal Dashboard FastAPI application using Docker Hub.

## 📋 Prerequisites

- Docker installed on your server
- Docker Compose installed
- Your Docker Hub credentials: `<your_dockerhub_username>` / `<your_dockerhub_access_token>`

## 🔥 Quick Start (Execute These Commands)

### 1. Login to Docker Hub
```bash
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin
```

### 2. Build and Push Image
```bash
# Build the image
docker build -t legal-dashboard .

# Tag for Docker Hub
docker tag legal-dashboard ${DOCKER_USERNAME}/legal-dashboard:latest

# Push to Docker Hub
docker push ${DOCKER_USERNAME}/legal-dashboard:latest
```

### 3. Deploy Immediately

#### Option A: Simple Local Deployment
```bash
docker run -d -p 8000:8000 --name legal-dashboard ${DOCKER_USERNAME}/legal-dashboard:latest
```

#### Option B: Production Deployment
```bash
docker run -d -p 80:8000 \
  --name legal-dashboard-prod \
  --restart unless-stopped \
  -e ENVIRONMENT=production \
  -e DEBUG=false \
  24498743/legal-dashboard:latest
```

#### Option C: With Volume Mounts
```bash
docker run -d -p 8000:8000 \
  --name legal-dashboard \
  -v ./data:/app/data \
  -v ./logs:/app/logs \
  --restart unless-stopped \
  24498743/legal-dashboard:latest
```

## 🏭 Production Deployment with Docker Compose

### 1. Start Full Stack
```bash
# Start all services (app, database, redis, nginx)
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f legal-dashboard
```

### 2. Stop Services
```bash
docker-compose -f docker-compose.production.yml down
```

## 📱 Using the Deployment Script

### Make Script Executable
```bash
chmod +x docker-deploy.sh
```

### Deploy in Different Modes
```bash
# Local development mode
./docker-deploy.sh local

# Production mode (default)
./docker-deploy.sh production
./docker-deploy.sh  # same as above
```

## 🔍 Monitoring Commands

### Container Health Checks
```bash
# Check container status
docker ps --filter "name=legal-dashboard"

# Check container health
docker inspect --format='{{.State.Health.Status}}' legal-dashboard

# View container logs
docker logs -f legal-dashboard

# Last 50 lines of logs
docker logs --tail 50 legal-dashboard
```

### Application Health
```bash
# Test health endpoint (local)
curl -f http://localhost:8000/health

# Test health endpoint (production)
curl -f http://localhost/health

# Test API endpoints
curl http://localhost:8000/api/dashboard/statistics
curl http://localhost:8000/api/dashboard/activity
```

## 🔄 Update and Maintenance

### Update to Latest Version
```bash
# Pull latest image
docker pull 24498743/legal-dashboard:latest

# Stop current container
docker stop legal-dashboard

# Remove old container
docker rm legal-dashboard

# Start new container
docker run -d -p 8000:8000 --name legal-dashboard --restart unless-stopped 24498743/legal-dashboard:latest
```

### Quick Update Script
```bash
# One-liner for quick updates
docker stop legal-dashboard && docker rm legal-dashboard && docker pull 24498743/legal-dashboard:latest && docker run -d -p 8000:8000 --name legal-dashboard --restart unless-stopped 24498743/legal-dashboard:latest
```

### Backup and Restore
```bash
# Backup container data
docker run --rm -v legal-dashboard-data:/data -v $(pwd):/backup alpine tar czf /backup/legal-dashboard-backup.tar.gz /data

# Restore container data
docker run --rm -v legal-dashboard-data:/data -v $(pwd):/backup alpine tar xzf /backup/legal-dashboard-backup.tar.gz
```

## 🛠️ Troubleshooting

### Check Container Logs
```bash
# Real-time logs
docker logs -f legal-dashboard

# Logs from last hour
docker logs --since 1h legal-dashboard

# Logs with timestamps
docker logs -t legal-dashboard
```

### Restart Container
```bash
# Restart container
docker restart legal-dashboard

# Force restart
docker kill legal-dashboard && docker start legal-dashboard
```

### Access Container Shell
```bash
# Enter container for debugging
docker exec -it legal-dashboard /bin/bash

# Or with sh if bash is not available
docker exec -it legal-dashboard /bin/sh
```

### Common Issues

#### Port Already in Use
```bash
# Find what's using the port
sudo lsof -i :8000

# Kill process using port
sudo kill -9 $(sudo lsof -t -i:8000)
```

#### Container Won't Start
```bash
# Check Docker daemon
sudo systemctl status docker

# Check container configuration
docker inspect legal-dashboard

# Remove and recreate container
docker rm -f legal-dashboard
```

## 🌐 Access URLs

- **Local Development**: http://localhost:8000
- **Production**: http://localhost or http://your-server-ip
- **Health Check**: http://localhost:8000/health
- **API Statistics**: http://localhost:8000/api/dashboard/statistics
- **API Activity**: http://localhost:8000/api/dashboard/activity

## 📊 Container Resource Usage

### Monitor Resource Usage
```bash
# Real-time resource usage
docker stats legal-dashboard

# Container resource limits
docker inspect legal-dashboard | grep -A 10 "HostConfig"
```

### Set Resource Limits
```bash
# Run with resource limits
docker run -d -p 8000:8000 \
  --name legal-dashboard \
  --memory="512m" \
  --cpus="1.0" \
  --restart unless-stopped \
  24498743/legal-dashboard:latest
```

## 🔐 Security Considerations

### Environment Variables
```bash
# Use environment file
docker run -d -p 8000:8000 --env-file .env --name legal-dashboard 24498743/legal-dashboard:latest
```

### Non-root User
The Docker image runs as a non-root user (`appuser`) for security.

### Network Security
```bash
# Create custom network
docker network create legal-network

# Run container in custom network
docker run -d --network legal-network --name legal-dashboard 24498743/legal-dashboard:latest
```

## 🚀 Auto-deployment with GitHub Actions

The repository includes a GitHub Actions workflow that automatically:
1. Builds the Docker image on every push to main
2. Pushes to Docker Hub using your credentials
3. Runs security scans
4. Tests the container

**Setup:**
1. Add `DOCKER_PASSWORD` secret to your GitHub repository
2. Set the value to your Docker Hub access token (PAT)
3. Push to main branch to trigger automatic deployment

## 📞 Support Commands

### Container Information
```bash
# Show all legal-dashboard related containers
docker ps -a --filter "name=legal-dashboard"

# Show container configuration
docker inspect legal-dashboard

# Show image information
docker images | grep legal-dashboard
```

### Cleanup Commands
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a
```

---

## 🎯 Summary

Your Legal Dashboard is now ready for deployment! Use these commands:

1. **Quick Test**: `docker run -d -p 8000:8000 --name legal-dashboard ${DOCKER_USERNAME}/legal-dashboard:latest`
2. **Production**: `./docker-deploy.sh production`
3. **Full Stack**: `docker-compose -f docker-compose.production.yml up -d`

**Access your application at**: http://localhost:8000 (local) or http://localhost (production)