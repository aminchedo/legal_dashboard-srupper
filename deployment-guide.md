# Legal Dashboard Deployment Guide

## 🚀 Quick Start - Local Testing

### 1. Test Your Docker Image Locally

```bash
# Pull latest image
docker pull 24498743/legal-dashboard:latest

# Run the container
docker run -d -p 8000:8000 --name legal-dashboard-app 24498743/legal-dashboard:latest

# Check if it's running
docker ps

# View logs
docker logs legal-dashboard-app

# Test if API is responding
curl http://localhost:8000

# Test Swagger documentation
curl http://localhost:8000/docs

# Test health endpoint
curl http://localhost:8000/health

# Stop and remove test container
docker stop legal-dashboard-app
docker rm legal-dashboard-app
```

### 2. Test All Endpoints

```bash
# Test main endpoint
curl http://localhost:8000/

# Test health check
curl http://localhost:8000/health

# Test API documentation
curl http://localhost:8000/docs

# Test OpenAPI schema
curl http://localhost:8000/openapi.json

# Test with headers
curl -H "Accept: application/json" http://localhost:8000/

# Test with different content types
curl -H "Content-Type: application/json" http://localhost:8000/
```

## 🏗️ Production Deployment Options

### Option A: Simple VPS/Server Deployment

#### 1. Server Setup Commands

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

#### 2. Nginx Configuration

Create `/etc/nginx/sites-available/legal-dashboard`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/legal-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3. SSL Certificate Setup

```bash
# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Option B: Cloud Platform Deployment

#### DigitalOcean Droplet

```bash
# Create droplet with Docker pre-installed
# SSH into droplet
ssh root@your-droplet-ip

# Pull and run your application
docker pull 24498743/legal-dashboard:latest
docker run -d -p 8000:8000 --name legal-dashboard --restart unless-stopped 24498743/legal-dashboard:latest

# Install Nginx and configure as above
```

#### AWS EC2

```bash
# Launch EC2 instance (Ubuntu 20.04 LTS)
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install docker.io -y
sudo usermod -aG docker ubuntu

# Pull and run application
docker pull 24498743/legal-dashboard:latest
docker run -d -p 8000:8000 --name legal-dashboard --restart unless-stopped 24498743/legal-dashboard:latest
```

#### Google Cloud Run

```bash
# Install gcloud CLI
# Deploy to Cloud Run
gcloud run deploy legal-dashboard \
  --image 24498743/legal-dashboard:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000
```

### Option C: Container Orchestration with Docker Compose

## 📦 Production Docker Compose Setup

### 1. Create Production docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    image: 24498743/legal-dashboard:latest
    container_name: legal-dashboard-app
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://legal_user:legal_password@db:5432/legal_dashboard
      - REDIS_URL=redis://redis:6379
      - ENVIRONMENT=production
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
      - redis
    networks:
      - legal-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    image: postgres:15-alpine
    container_name: legal-dashboard-db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=legal_dashboard
      - POSTGRES_USER=legal_user
      - POSTGRES_PASSWORD=legal_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - legal-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U legal_user -d legal_dashboard"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: legal-dashboard-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - legal-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: legal-dashboard-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - legal-network

  certbot:
    image: certbot/certbot
    container_name: legal-dashboard-certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email your-email@example.com --agree-tos --no-eff-email -d your-domain.com

volumes:
  postgres_data:
  redis_data:

networks:
  legal-network:
    driver: bridge
```

### 2. Create Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:8000;
    }

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 3. Environment Variables

Create `.env` file:

```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://legal_user:legal_password@db:5432/legal_dashboard
REDIS_URL=redis://redis:6379
ENVIRONMENT=production
```

## 🔧 Deployment Commands

### 1. Start Production Stack

```bash
# Create necessary directories
mkdir -p ssl certbot/www

# Start the stack
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### 2. SSL Certificate Setup

```bash
# Get initial certificate
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email your-email@example.com --agree-tos --no-eff-email -d your-domain.com

# Renew certificates (add to crontab)
0 12 * * * docker-compose run --rm certbot renew --quiet && docker-compose exec nginx nginx -s reload
```

## 📊 Monitoring and Maintenance

### 1. Health Checks

```bash
# Check all services
docker-compose ps

# Check app health
curl http://localhost:8000/health

# Check database
docker-compose exec db pg_isready -U legal_user -d legal_dashboard

# Check Redis
docker-compose exec redis redis-cli ping
```

### 2. Log Management

```bash
# View all logs
docker-compose logs

# Follow app logs
docker-compose logs -f app

# View nginx logs
docker-compose logs nginx
```

### 3. Backup Strategy

```bash
# Backup database
docker-compose exec db pg_dump -U legal_user legal_dashboard > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup volumes
docker run --rm -v legal-dashboard_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### 4. Update Procedures

```bash
# Update application
docker-compose pull app
docker-compose up -d app

# Update all services
docker-compose pull
docker-compose up -d

# Rollback if needed
docker-compose up -d app:previous-tag
```

## 🔒 Security Best Practices

### 1. Firewall Configuration

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Docker Security

```bash
# Run containers as non-root user
# Use specific image tags instead of 'latest'
# Regularly update base images
# Scan images for vulnerabilities
docker scan 24498743/legal-dashboard:latest
```

### 3. Environment Security

```bash
# Use strong passwords
# Rotate secrets regularly
# Use environment variables for sensitive data
# Enable audit logging
```

## 🚀 Quick Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

# Legal Dashboard Deployment Script

echo "🚀 Deploying Legal Dashboard..."

# Pull latest image
echo "📦 Pulling latest image..."
docker pull 24498743/legal-dashboard:latest

# Create necessary directories
mkdir -p ssl certbot/www

# Start services
echo "🏗️ Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check health
echo "🏥 Checking health..."
curl -f http://localhost:8000/health || echo "Health check failed"

# Show status
echo "📊 Service status:"
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Access your application at: http://localhost:8000"
echo "📚 API docs at: http://localhost:8000/docs"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📋 Checklist

- [ ] Docker image tested locally
- [ ] Production docker-compose.yml created
- [ ] Nginx configuration set up
- [ ] SSL certificates obtained
- [ ] Environment variables configured
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Update procedures documented
- [ ] Security measures applied

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :8000
   sudo kill -9 <PID>
   ```

2. **SSL certificate issues**
   ```bash
   docker-compose run --rm certbot renew --force-renewal
   docker-compose restart nginx
   ```

3. **Database connection issues**
   ```bash
   docker-compose logs db
   docker-compose restart db
   ```

4. **Application not responding**
   ```bash
   docker-compose logs app
   docker-compose restart app
   ```

This comprehensive guide provides everything you need to deploy your Legal Dashboard application in production. Start with the local testing commands, then choose your preferred deployment option!