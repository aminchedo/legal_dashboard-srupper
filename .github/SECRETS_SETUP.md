# GitHub Secrets Setup Guide

## 🔐 Required Secrets

Add these secrets to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### Core Docker Secrets
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | `24498743` |
| `DOCKER_TOKEN` | Your Docker Hub access token | `dckr_pat_11XAFYII0Y7K9QGZD0X5A11Z18` |

### Platform-Specific Secrets

#### DigitalOcean App Platform
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | DigitalOcean API token | [DigitalOcean API Tokens](https://cloud.digitalocean.com/account/api/tokens) |

#### Railway
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `RAILWAY_TOKEN` | Railway API token | `railway login` then copy from `~/.railway/config.json` |

#### Render
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `RENDER_API_KEY` | Render API key | [Render API Keys](https://render.com/docs/api) |
| `RENDER_SERVICE_ID` | Your Render service ID | Found in service settings |

#### Fly.io
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `FLY_API_TOKEN` | Fly.io API token | `flyctl auth token` |

#### Google Cloud Run
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `GCP_SA_KEY` | Service account JSON key | [Google Cloud IAM](https://console.cloud.google.com/iam-admin/serviceaccounts) |
| `GCP_PROJECT_ID` | Google Cloud project ID | Found in project settings |
| `GCP_REGION` | Deployment region | `us-central1`, `europe-west1`, etc. |

## 🚀 How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the secret name and value
6. Click **Add secret**

## 🔒 Security Best Practices

### Token Management
- ✅ Use access tokens instead of passwords
- ✅ Set appropriate token permissions
- ✅ Rotate tokens regularly (every 90 days)
- ✅ Use environment-specific tokens
- ❌ Never commit tokens to code
- ❌ Never share tokens in logs

### Token Permissions
- **Docker Hub**: Read/Write access to repositories
- **DigitalOcean**: Read/Write access to apps
- **Railway**: Full access to projects
- **Render**: Read/Write access to services
- **Fly.io**: Full access to apps
- **Google Cloud**: Cloud Run Admin, Storage Admin

## 🛠️ Platform Setup Instructions

### DigitalOcean App Platform
1. Create a new app in DigitalOcean
2. Choose "Docker Hub" as image source
3. Set image: `24498743/legal-dashboard:latest`
4. Configure environment variables
5. Deploy

### Railway
1. Create new project
2. Add service from Docker Hub
3. Set image: `24498743/legal-dashboard:latest`
4. Configure environment variables
5. Deploy

### Render
1. Create new Web Service
2. Choose "Docker" environment
3. Set image: `24498743/legal-dashboard:latest`
4. Configure environment variables
5. Deploy

### Fly.io
1. Create new app: `flyctl apps create legal-dashboard`
2. Deploy: `flyctl deploy --image 24498743/legal-dashboard:latest`
3. Configure environment variables
4. Scale: `flyctl scale count 1`

### Google Cloud Run
1. Enable Cloud Run API
2. Create service account with Cloud Run Admin role
3. Deploy: `gcloud run deploy legal-dashboard --image 24498743/legal-dashboard:latest`
4. Configure environment variables

## 🔍 Testing Secrets

After adding secrets, test them by:
1. Making a small commit to trigger CI/CD
2. Check the Actions tab for successful runs
3. Verify deployments on target platforms

## 📋 Environment Variables

Configure these in your deployment platforms:

```bash
ENVIRONMENT=production
DEBUG=false
PYTHONUNBUFFERED=1
PYTHONDONTWRITEBYTECODE=1
PORT=8000
```

## 🚨 Troubleshooting

### Common Issues
- **Authentication failed**: Check token permissions and expiration
- **Build failed**: Verify Dockerfile and dependencies
- **Deployment failed**: Check platform-specific requirements
- **Health check failed**: Verify application startup and port configuration

### Debug Commands
```bash
# Test Docker image locally
docker run -p 8000:8000 24498743/legal-dashboard:latest

# Check container logs
docker logs <container_id>

# Test health endpoint
curl http://localhost:8000/health
```