# Secure CI/CD Pipeline with Token Management

## 🚀 Overview

This repository now includes a comprehensive, secure CI/CD pipeline that supports multiple deployment platforms with proper token management and security best practices.

## 🔐 Security Features

### ✅ Secure Token Management
- **No hardcoded tokens** in code or configuration files
- **GitHub Secrets** for all sensitive credentials
- **Environment variable validation** before deployment
- **Automatic token rotation** support
- **Secure token storage** using GitHub's encrypted secrets

### ✅ Security Scanning
- **Trivy vulnerability scanner** for container images
- **Bandit security linter** for Python code
- **GitHub CodeQL** integration for security analysis
- **Container health checks** before deployment

### ✅ Multi-Platform Support
- **Docker Hub** - Container registry
- **DigitalOcean App Platform** - Easy deployment
- **Railway** - Full-stack hosting
- **Render** - Free tier available
- **Fly.io** - Global deployment
- **Google Cloud Run** - Serverless containers

## 📋 Quick Start

### 1. Set Up GitHub Secrets

Go to your repository: **Settings → Secrets and variables → Actions**

Add these required secrets:

```bash
# Core Docker Secrets
DOCKER_USERNAME=<your_dockerhub_username>
DOCKER_TOKEN=<your_dockerhub_access_token>

# Platform-specific secrets (choose your platform)
DIGITALOCEAN_ACCESS_TOKEN=your_do_token
RAILWAY_TOKEN=your_railway_token
RENDER_API_KEY=your_render_key
RENDER_SERVICE_ID=your_service_id
FLY_API_TOKEN=your_fly_token
GCP_SA_KEY=your_gcp_service_account_json
GCP_PROJECT_ID=your_project_id
GCP_REGION=us-central1
```

### 2. Trigger Deployment

#### Option A: Automatic Deployment (GitHub Actions)
```bash
# Push to main branch triggers automatic deployment
git push origin main

# Or create a tag for versioned deployment
git tag v1.0.0
git push origin v1.0.0
```

#### Option B: Manual Deployment (Local)
```bash
# Set environment variables
export DOCKER_TOKEN="<your_dockerhub_access_token>"
export DOCKER_USERNAME="<your_dockerhub_username>"

# Deploy to specific platform
./scripts/secure-deploy.sh docker-hub
./scripts/secure-deploy.sh digitalocean
./scripts/secure-deploy.sh railway
./scripts/secure-deploy.sh render
./scripts/secure-deploy.sh fly-io
./scripts/secure-deploy.sh google-cloud-run
```

#### Option C: Manual Deployment (GitHub Actions)
1. Go to **Actions** tab
2. Select **Secure CI/CD Pipeline**
3. Click **Run workflow**
4. Choose deployment platform
5. Click **Run workflow**

## 🔧 Configuration Files

### Platform-Specific Configurations

| Platform | Config File | Description |
|----------|-------------|-------------|
| DigitalOcean | `deploy/digitalocean-app.yaml` | App Platform specification |
| Fly.io | `deploy/fly.toml` | Fly.io app configuration |
| Railway | `deploy/railway.json` | Railway project configuration |
| Render | `deploy/render.yaml` | Render service configuration |

### CI/CD Workflow

The main workflow file `.github/workflows/secure-ci-cd.yml` includes:

1. **Security Scanning** - Trivy and Bandit
2. **Build & Test** - Python and Node.js testing
3. **Docker Build** - Multi-platform image building
4. **Platform Deployment** - Conditional deployment to chosen platform
5. **Health Checks** - Container validation
6. **Deployment Summary** - Comprehensive status report

## 🛡️ Security Best Practices

### Token Management
- ✅ **Rotate tokens regularly** (every 90 days)
- ✅ **Use least privilege** - Only necessary permissions
- ✅ **Monitor token usage** - Check for unusual activity
- ✅ **Use environment-specific tokens** - Different tokens for dev/staging/prod
- ❌ **Never commit tokens** to version control
- ❌ **Never share tokens** in logs or error messages

### Container Security
- ✅ **Multi-stage builds** - Reduce attack surface
- ✅ **Non-root user** - Run containers as non-privileged user
- ✅ **Security scanning** - Regular vulnerability checks
- ✅ **Health checks** - Validate container functionality
- ✅ **Resource limits** - Prevent resource exhaustion

### Network Security
- ✅ **HTTPS only** - Force secure connections
- ✅ **CORS configuration** - Control cross-origin requests
- ✅ **Rate limiting** - Prevent abuse
- ✅ **Input validation** - Sanitize all inputs

## 📊 Monitoring and Logging

### GitHub Actions Monitoring
- **Workflow runs** - Track deployment success/failure
- **Security alerts** - Monitor vulnerability scans
- **Deployment summaries** - Comprehensive status reports

### Platform Monitoring
Each platform provides its own monitoring:
- **DigitalOcean** - App Platform metrics
- **Railway** - Real-time logs and metrics
- **Render** - Service health and logs
- **Fly.io** - Global monitoring
- **Google Cloud** - Cloud Run metrics

## 🚨 Troubleshooting

### Common Issues

#### Authentication Failures
```bash
# Check token validity
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Verify GitHub secrets are set correctly
# Go to Settings → Secrets and variables → Actions
```

#### Build Failures
```bash
# Test Docker build locally
docker build -t legal-dashboard:test .

# Check Dockerfile syntax
docker build --no-cache -t legal-dashboard:test .
```

#### Deployment Failures
```bash
# Check platform-specific requirements
# Verify environment variables
# Check platform quotas and limits
```

### Debug Commands
```bash
# Test container locally
docker run -p 8000:8000 ${DOCKER_USERNAME:-your-username}/legal-dashboard:latest

# Check container logs
docker logs <container_id>

# Test health endpoint
curl http://localhost:8000/health

# Verify image exists
docker pull ${DOCKER_USERNAME}/legal-dashboard:latest
```

## 🔄 Continuous Deployment

### Automatic Triggers
- **Push to main** - Automatic deployment to Docker Hub
- **Tag creation** - Versioned deployment
- **Pull requests** - Build and test only
- **Manual trigger** - Choose platform and deploy

### Environment Promotion
```bash
# Development
git push origin develop  # Build and test only

# Staging
git push origin staging  # Deploy to staging environment

# Production
git push origin main     # Deploy to production
git tag v1.0.0          # Versioned release
git push origin v1.0.0  # Deploy specific version
```

## 📈 Scaling and Performance

### Resource Optimization
- **Multi-platform builds** - AMD64 and ARM64 support
- **Layer caching** - Faster builds
- **Resource limits** - Prevent resource exhaustion
- **Auto-scaling** - Platform-specific scaling

### Cost Optimization
- **Free tiers** - Render, Railway, Fly.io
- **Pay-per-use** - Google Cloud Run
- **Resource limits** - Control costs
- **Auto-stop** - Stop unused resources

## 🔗 Platform-Specific Guides

### DigitalOcean App Platform
- [Setup Guide](https://docs.digitalocean.com/products/app-platform/)
- [Pricing](https://www.digitalocean.com/pricing/app-platform)
- [CLI Tool](https://docs.digitalocean.com/reference/doctl/)

### Railway
- [Setup Guide](https://docs.railway.app/)
- [Pricing](https://railway.app/pricing)
- [CLI Tool](https://docs.railway.app/develop/cli)

### Render
- [Setup Guide](https://render.com/docs)
- [Pricing](https://render.com/pricing)
- [API Documentation](https://render.com/docs/api)

### Fly.io
- [Setup Guide](https://fly.io/docs/)
- [Pricing](https://fly.io/docs/pricing/)
- [CLI Tool](https://fly.io/docs/hands-on/install-flyctl/)

### Google Cloud Run
- [Setup Guide](https://cloud.google.com/run/docs)
- [Pricing](https://cloud.google.com/run/pricing)
- [CLI Tool](https://cloud.google.com/sdk/gcloud)

## 📞 Support

For issues with:
- **CI/CD Pipeline** - Check GitHub Actions logs
- **Platform Deployment** - Check platform-specific documentation
- **Security Issues** - Review security scan results
- **Token Management** - Follow the secrets setup guide

## 🔄 Migration from Old Setup

If you're migrating from the old hardcoded token setup:

1. **Remove hardcoded tokens** from workflow files
2. **Add secrets** to GitHub repository
3. **Update deployment scripts** to use environment variables
4. **Test the new pipeline** with a small change
5. **Monitor deployments** for any issues

The new setup is backward compatible and will work with your existing Docker image.