# CI/CD Pipeline Deployment Guide

## 🚀 Overview

This guide covers the complete GitHub Actions CI/CD pipeline for the Legal Dashboard project, including Docker image building, multi-platform support, and automated deployment to Docker Hub.

## 📋 Pipeline Components

### 1. GitHub Actions Workflow
- **File:** `.github/workflows/docker-build.yml`
- **Trigger:** Push to `main`/`develop` branches, Pull Requests
- **Features:** Multi-platform builds, automated testing, metadata extraction

### 2. Docker Configuration
- **Dockerfile:** Optimized multi-stage build with security best practices
- **.dockerignore:** Optimized build context for faster builds
- **Platforms:** linux/amd64, linux/arm64

### 3. Dependabot Integration
- **File:** `.github/dependabot.yml`
- **Updates:** GitHub Actions, npm, and pip dependencies
- **Schedule:** Weekly automated updates

## 🔧 Current Configuration

### Docker Hub Settings
- **Username:** 24498743
- **Repository:** legal-dashboard
- **Image:** 24498743/legal-dashboard:latest

### Workflow Features
- ✅ Multi-platform builds (AMD64, ARM64)
- ✅ Automated testing with health checks
- ✅ Build caching for faster builds
- ✅ Metadata extraction and labeling
- ✅ Conditional push (no push on PRs)

## 🛡️ Security Considerations

### ⚠️ IMPORTANT: Current Security Status

**Temporary Configuration (For Testing):**
- Docker Hub credentials are hardcoded in the workflow file
- This is **NOT** recommended for production use
- Credentials are visible in the repository

### 🔒 Production Security Steps

1. **Remove Hardcoded Credentials**
   ```yaml
   # Current (INSECURE):
   env:
     DOCKER_TOKEN: "dckr_pat_O4ZPRcyCYKk2PfwLhsbpP1lF4sc"
   
   # Production (SECURE):
   env:
     DOCKER_TOKEN: ${{ secrets.DOCKER_TOKEN }}
   ```

2. **Set Up GitHub Secrets**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DOCKER_TOKEN`: Your Docker Hub Personal Access Token
     - `DOCKER_USERNAME`: Your Docker Hub username

3. **Update Workflow File**
   - Replace hardcoded credentials with `${{ secrets.DOCKER_TOKEN }}`
   - Remove the token from the repository immediately

4. **Additional Security Measures**
   - Enable vulnerability scanning in Docker Hub
   - Regularly rotate access tokens
   - Use least-privilege access tokens
   - Enable branch protection rules

## 🚀 Deployment Process

### Automated Deployment
1. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "feat: update application"
   git push origin main
   ```

2. **GitHub Actions Pipeline**
   - Workflow automatically triggers
   - Builds Docker image for multiple platforms
   - Runs health check tests
   - Pushes to Docker Hub if tests pass

3. **Deploy to Production**
   ```bash
   # Pull latest image
   docker pull 24498743/legal-dashboard:latest
   
   # Run with custom configuration
   docker run -d \
     --name legal-dashboard \
     -p 8000:8000 \
     -e DATABASE_URL=/app/data/legal.db \
     -e JWT_SECRET=your-secure-secret \
     -v /host/data:/app/data \
     24498743/legal-dashboard:latest
   ```

### Manual Deployment
```bash
# Build locally
docker build -t legal-dashboard .

# Test locally
docker run -p 8000:8000 legal-dashboard

# Push to Docker Hub
docker tag legal-dashboard 24498743/legal-dashboard:latest
docker push 24498743/legal-dashboard:latest
```

## 📊 Monitoring and Troubleshooting

### Workflow Monitoring
- **GitHub Actions:** View workflow runs in the Actions tab
- **Docker Hub:** Monitor image builds and pulls
- **Health Checks:** Automated container health verification

### Common Issues

1. **Build Failures**
   ```bash
   # Check workflow logs
   # Verify Dockerfile syntax
   # Ensure all dependencies are in requirements.txt
   ```

2. **Authentication Errors**
   ```bash
   # Verify Docker Hub credentials
   # Check token permissions
   # Ensure secrets are properly configured
   ```

3. **Health Check Failures**
   ```bash
   # Verify application starts correctly
   # Check port configuration
   # Ensure health endpoint is accessible
   ```

## 🔄 Dependabot Configuration

### Automated Updates
- **GitHub Actions:** Weekly updates
- **npm Dependencies:** Weekly updates
- **Python Dependencies:** Weekly updates

### Update Process
1. Dependabot creates pull requests for updates
2. Automated tests run on PRs
3. Manual review and approval required
4. Merged updates trigger new builds

## 📈 Performance Optimization

### Build Optimizations
- **Multi-stage builds:** Separate build and runtime stages
- **Layer caching:** Optimized Docker layer ordering
- **Build context:** Comprehensive .dockerignore file
- **Parallel builds:** Multi-platform builds in parallel

### Runtime Optimizations
- **Non-root user:** Security best practice
- **Health checks:** Automated container monitoring
- **Resource limits:** Configurable via Docker run options

## 🎯 Next Steps

### Immediate Actions
1. ✅ Test the current pipeline
2. ⏳ Move credentials to GitHub Secrets
3. ⏳ Enable branch protection rules
4. ⏳ Set up monitoring and alerting

### Future Enhancements
- [ ] Add vulnerability scanning
- [ ] Implement blue-green deployments
- [ ] Add performance testing
- [ ] Set up automated rollbacks
- [ ] Implement staging environment

## 📞 Support

For issues with the CI/CD pipeline:
1. Check GitHub Actions logs
2. Verify Docker Hub repository access
3. Review security configuration
4. Test locally with Docker commands

---

**Last Updated:** $(date)
**Pipeline Version:** 1.0.0
**Security Status:** ⚠️ Temporary (Hardcoded Credentials)