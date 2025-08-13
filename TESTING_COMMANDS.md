# Legal Dashboard - Testing Commands

## 🧪 COMPLETE TESTING PIPELINE

Run these commands when you have Docker available to test the complete deployment pipeline.

## ⚡ QUICK TEST (All-in-One)

```bash
#!/bin/bash
# Complete deployment test script

echo "🚀 Testing Legal Dashboard Deployment Pipeline..."

# 1. Test Python requirements
echo "📦 Testing requirements.txt..."
python3 -m venv test_env
source test_env/bin/activate
pip install --no-cache-dir -r requirements.txt
deactivate
rm -rf test_env

# 2. Login to Docker Hub
echo "🐳 Logging into Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

# 3. Build Docker image
echo "🔨 Building Docker image..."
docker build -t legal-dashboard .

# 4. Test local container
echo "🧪 Testing container locally..."
docker run -d -p 8000:8000 --name legal-test legal-dashboard

# Wait for container to start
sleep 10

# 5. Test endpoints
echo "🌐 Testing endpoints..."
curl -f http://localhost:8000 && echo "✅ Root endpoint working"
curl -f http://localhost:8000/docs && echo "✅ Docs endpoint working"

# 6. Check container logs
echo "📋 Container logs:"
docker logs legal-test

# 7. Clean up test container
echo "🧹 Cleaning up..."
docker stop legal-test
docker rm legal-test

# 8. Tag and push to Docker Hub
echo "🚀 Pushing to Docker Hub..."
TAG_TS=$(date +%Y%m%d_%H%M%S)

docker tag legal-dashboard ${DOCKER_USERNAME}/legal-dashboard:latest
docker tag legal-dashboard ${DOCKER_USERNAME}/legal-dashboard:${TAG_TS}

docker push ${DOCKER_USERNAME}/legal-dashboard:latest
docker push ${DOCKER_USERNAME}/legal-dashboard:${TAG_TS}

echo "✅ Deployment test completed!"
echo "🌐 Image: 24498743/legal-dashboard:latest"
echo "🌐 Image (timestamp): 24498743/legal-dashboard:${TAG_TS}"
```

## 🔍 INDIVIDUAL TEST COMMANDS

### 1. Test Requirements Installation
```bash
python3 -m venv test_env
source test_env/bin/activate
pip install --no-cache-dir -r requirements.txt
python -c "import fastapi, uvicorn; print('✅ FastAPI and Uvicorn imported successfully')"
deactivate
rm -rf test_env
```

### 2. Test Docker Build
```bash
docker build -t legal-dashboard .
```

### 3. Test Local Container
```bash
# Run container
docker run -d -p 8000:8000 --name legal-test legal-dashboard

# Wait and test
sleep 5
curl http://localhost:8000
curl http://localhost:8000/docs

# Check logs
docker logs legal-test

# Clean up
docker stop legal-test
docker rm legal-test
```

### 4. Test Docker Hub Push
```bash
# Login
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Tag
docker tag legal-dashboard ${DOCKER_USERNAME}/legal-dashboard:latest

# Push
docker push ${DOCKER_USERNAME}/legal-dashboard:latest

# Verify
docker pull ${DOCKER_USERNAME}/legal-dashboard:latest
```

### 5. Test Production Image
```bash
# Pull from Docker Hub and test
docker pull ${DOCKER_USERNAME}/legal-dashboard:latest
docker run -d -p 8000:8000 --name prod-test ${DOCKER_USERNAME}/legal-dashboard:latest

sleep 5
curl http://localhost:8000
docker logs prod-test
docker stop prod-test
docker rm prod-test
```

## 🐳 DOCKER COMPOSE TESTING

### Local Development Stack
```bash
# Start full stack
docker-compose up --build

# Test in another terminal
curl http://localhost:8000
curl http://localhost:8000/docs

# Stop
docker-compose down
```

## 🔧 TROUBLESHOOTING TESTS

### Check Docker Installation
```bash
docker --version
docker info
docker ps
```

### Test Network Connectivity
```bash
# Test container networking
docker run --rm -p 8001:8000 24498743/legal-dashboard:latest &
sleep 5
curl http://localhost:8001
pkill -f legal-dashboard
```

### Debug Container Issues
```bash
# Run container interactively
docker run -it --rm legal-dashboard /bin/bash

# Inside container:
ls -la
cat requirements.txt
python -c "import fastapi; print('FastAPI version:', fastapi.__version__)"
uvicorn --version
```

## 🧪 AZURE DEPLOYMENT TESTING

### Test Azure Web App (Replace with your app name)
```bash
APP_NAME="your-legal-dashboard-app"

# Test health endpoint
curl https://${APP_NAME}.azurewebsites.net/

# Test docs
curl https://${APP_NAME}.azurewebsites.net/docs

# Test with verbose output
curl -v https://${APP_NAME}.azurewebsites.net/
```

## 📊 PERFORMANCE TESTING

### Load Test Local Container
```bash
# Start container
docker run -d -p 8000:8000 --name perf-test legal-dashboard

# Simple load test (if curl is available)
for i in {1..100}; do
  curl -s http://localhost:8000 > /dev/null && echo "Request $i: OK"
done

# Clean up
docker stop perf-test
docker rm perf-test
```

## 🔍 VALIDATION CHECKLIST

Run this checklist after deployment:

- [ ] `requirements.txt` installs without errors
- [ ] `Dockerfile` builds successfully  
- [ ] Docker image runs locally on port 8000
- [ ] Root endpoint returns `{"status": "ok", "message": "Legal Dashboard API is running"}`
- [ ] `/docs` endpoint shows FastAPI documentation
- [ ] Image pushes successfully to `24498743/legal-dashboard:latest`
- [ ] GitHub Actions workflow syntax is valid
- [ ] `deploy.sh` script is executable
- [ ] Azure configuration values are correct
- [ ] Production deployment responds correctly

## 🚨 ERROR DEBUGGING

### Common Issues and Solutions

**Docker build fails:**
```bash
# Check Docker daemon
docker info

# Rebuild with no cache
docker build --no-cache -t legal-dashboard .

# Check for syntax errors
docker run --rm -v $(pwd):/app alpine sh -c "cd /app && python -m py_compile main.py"
```

**Container exits immediately:**
```bash
# Check logs
docker logs legal-test

# Run with interactive shell
docker run -it --rm legal-dashboard /bin/bash
```

**Port binding issues:**
```bash
# Check if port is in use
netstat -tlnp | grep :8000

# Use different port
docker run -d -p 8001:8000 --name legal-test legal-dashboard
```

**Requirements installation fails:**
```bash
# Test individual packages
pip install fastapi==0.104.1
pip install uvicorn[standard]==0.24.0

# Check Python version
python --version
```

---

💡 **Tip**: Save this file as `test-deployment.sh`, make it executable with `chmod +x test-deployment.sh`, and run it whenever you want to test the complete pipeline!