# 🚀 Legal Dashboard - Quick Deployment Guide

## ✅ Your Docker Image is Ready!

Your Legal Dashboard application has been successfully built and pushed to Docker Hub:
- **Image**: `24498743/legal-dashboard:latest`
- **Status**: ✅ Ready for deployment

## 🧪 IMMEDIATE TESTING COMMANDS

Run these commands on your local machine or server to test your application:

### 1. Test Local Deployment

```bash
# Pull latest image
docker pull 24498743/legal-dashboard:latest

# Run the container
docker run -d -p 8000:8000 --name test-legal-dashboard 24498743/legal-dashboard:latest

# Wait a moment then test
sleep 5

# Test if API is responding
curl http://localhost:8000

# Test Swagger documentation
curl http://localhost:8000/docs

# Test health endpoint
curl http://localhost:8000/health

# Show container status
docker ps | grep legal-dashboard

# Show logs
docker logs test-legal-dashboard

# Stop and remove test container
docker stop test-legal-dashboard
docker rm test-legal-dashboard
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

## 🏗️ PRODUCTION DEPLOYMENT

### Option 1: Simple Production Setup (Recommended)

1. **Download the deployment files**:
   ```bash
   # Create deployment directory
   mkdir legal-dashboard-production
   cd legal-dashboard-production
   
   # Copy the files from this repository:
   # - docker-compose.yml
   # - nginx.conf
   # - .env
   # - deploy.sh
   # - init-db.sql
   ```

2. **Configure your domain**:
   ```bash
   # Edit .env file
   nano .env
   # Change: your-domain.com to your actual domain
   # Change: your-email@example.com to your actual email
   ```

3. **Deploy with one command**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh your-domain.com your-email@example.com
   ```

### Option 2: Manual Production Setup

1. **Install Docker and Docker Compose**:
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Start the production stack**:
   ```bash
   # Create directories
   mkdir -p ssl certbot/www logs
   
   # Start services
   docker-compose up -d
   
   # Check status
   docker-compose ps
   
   # View logs
   docker-compose logs -f app
   ```

3. **Setup SSL certificate**:
   ```bash
   # Get SSL certificate
   docker-compose run --rm certbot certonly \
     --webroot \
     --webroot-path=/var/www/certbot \
     --email your-email@example.com \
     --agree-tos \
     --no-eff-email \
     -d your-domain.com
   
   # Reload nginx
   docker-compose restart nginx
   ```

## 🌐 ACCESS YOUR APPLICATION

After deployment, access your application at:

- **🌐 Application**: `http://your-domain.com` (redirects to HTTPS)
- **🔒 Secure**: `https://your-domain.com`
- **📚 API Docs**: `https://your-domain.com/docs`
- **🏥 Health Check**: `https://your-domain.com/health`
- **📊 Grafana**: `http://localhost:3000` (admin/admin_password_change_this)
- **📈 Prometheus**: `http://localhost:9090`

## 🔧 USEFUL COMMANDS

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f db

# Check service status
docker-compose ps

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Update application
docker-compose pull app
docker-compose up -d app

# Backup database
docker-compose exec db pg_dump -U legal_user legal_dashboard > backup.sql

# Access database
docker-compose exec db psql -U legal_user -d legal_dashboard

# Access Redis
docker-compose exec redis redis-cli -a redis_password
```

## 🔒 SECURITY CHECKLIST

- [ ] Change default passwords in `.env` file
- [ ] Update `SECRET_KEY` with a strong random key
- [ ] Configure firewall (allow ports 80, 443, 22)
- [ ] Set up SSL certificate auto-renewal
- [ ] Configure regular backups
- [ ] Set up monitoring alerts
- [ ] Update DNS records to point to your server

## 🆘 TROUBLESHOOTING

### Common Issues:

1. **Port already in use**:
   ```bash
   sudo lsof -i :8000
   sudo kill -9 <PID>
   ```

2. **SSL certificate issues**:
   ```bash
   docker-compose run --rm certbot renew --force-renewal
   docker-compose restart nginx
   ```

3. **Database connection issues**:
   ```bash
   docker-compose logs db
   docker-compose restart db
   ```

4. **Application not responding**:
   ```bash
   docker-compose logs app
   docker-compose restart app
   ```

## 📊 MONITORING

Your production setup includes:

- **Prometheus**: Metrics collection
- **Grafana**: Dashboard and visualization
- **Health checks**: Automatic service monitoring
- **Log aggregation**: Centralized logging
- **SSL monitoring**: Certificate expiration alerts

## 🔄 UPDATES

To update your application:

```bash
# Pull latest image
docker-compose pull app

# Restart application
docker-compose up -d app

# Check status
docker-compose ps
curl https://your-domain.com/health
```

## 📞 SUPPORT

If you encounter any issues:

1. Check the logs: `docker-compose logs -f`
2. Verify configuration files
3. Test individual services
4. Check network connectivity
5. Review security settings

---

**🎉 Congratulations! Your Legal Dashboard is now ready for production use!**