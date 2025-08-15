# 🌐 ngrok Live Demo Setup Instructions

## AUTHTOKEN PROVIDED:
```
314Xps5bkUs1VE7JE0wk8sX9dtg_2m9fX5nrn3eX7x23kwWNf
```

## 📋 Step-by-Step GitHub Secrets Configuration

### 1. Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/aminchedo/legal_dashboard-srupper`
2. Click on the **"Settings"** tab in the top menu bar
3. Ensure you have admin access to the repository

### 2. Access Secrets and Variables
1. In the left sidebar, locate **"Security"** section
2. Click on **"Secrets and variables"**
3. Click on **"Actions"** from the dropdown

### 3. Add New Repository Secret
1. Click the **"New repository secret"** button (green button)
2. Fill in the secret details:
   - **Name:** `NGROK_AUTHTOKEN`
   - **Secret:** `314Xps5bkUs1VE7JE0wk8sX9dtg_2m9fX5nrn3eX7x23kwWNf`
3. Click **"Add secret"** to save

### 4. Verify Secret Creation
- You should see `NGROK_AUTHTOKEN` listed in your repository secrets
- The value will be hidden for security (showing as `***`)
- Note the creation timestamp

## 🚀 Testing the ngrok Workflow

### Option 1: Manual Trigger (Recommended for Testing)
1. Go to **Actions** tab in your repository
2. Click on **"🌐 ngrok Live Demo (Authenticated)"** workflow
3. Click **"Run workflow"** button
4. Select `main` branch and click **"Run workflow"**

### Option 2: Automatic Trigger
- The workflow will automatically run when you push to the `main` branch
- Any commits to `main` will trigger the live demo

## ⏱️ What to Expect

### Workflow Timeline:
- **0-2 minutes:** Setup and dependency installation
- **2-4 minutes:** Backend and frontend startup
- **4-6 minutes:** ngrok tunnel establishment
- **6+ minutes:** Live demo running (2-hour duration)

### Success Indicators:
✅ "ngrok configured with provided authtoken"
✅ "Backend health check passed"
✅ "Frontend accessibility confirmed"
✅ "ngrok tunnel is publicly accessible!"
✅ Live URL displayed in logs

## 📊 Accessing Your Live Demo

### 1. View Workflow Results
- Monitor the workflow run in the Actions tab
- Look for the ngrok URL in the deployment logs
- URL format: `https://[random-id].ngrok-free.app`

### 2. Download Demo Report
- After workflow completion, download the `ngrok-live-demo-results` artifact
- Extract and open `ngrok-live-demo-report.html`
- Beautiful dashboard with live URL and status cards

### 3. Share the Live Demo
- The ngrok URL is publicly accessible
- No authentication required for viewers
- Valid for 2 hours with the authenticated token

## 🔧 Troubleshooting

### Common Issues and Solutions:

#### ❌ "NGROK_AUTHTOKEN not found"
**Solution:** Verify the secret name is exactly `NGROK_AUTHTOKEN` (case-sensitive)

#### ❌ "ngrok config check failed"
**Solution:** Check if the authtoken is valid and not expired

#### ❌ "Failed to extract ngrok URL"
**Solution:** 
- Check ngrok logs in the workflow output
- Verify both backend (port 3001) and frontend (port 5173) are running
- Ensure no port conflicts

#### ❌ "Backend health check failed"
**Solution:** 
- Check if `backend/server.js` exists and is executable
- Verify backend dependencies are installed correctly
- Check for port 3001 availability

#### ❌ "Frontend build failed"
**Solution:**
- Verify `frontend/package.json` has correct build scripts
- Check for missing dependencies
- Ensure Node.js 18 compatibility

## 📈 Workflow Features

### 🔒 Security Features:
- Authenticated ngrok tunnel (no warning pages)
- HTTPS encryption enabled
- Temporary 2-hour sessions
- No persistent storage of sensitive data

### 📊 Monitoring Features:
- Real-time connectivity checks every 15 minutes
- Process health monitoring
- Comprehensive logging
- Artifact generation for debugging

### 🎨 Demo Features:
- Beautiful HTML report with embedded dashboard
- Quick access links to API endpoints
- Status cards showing service health
- Responsive design for all devices

## 🆚 ngrok vs LocalTunnel Comparison

| Feature | ngrok (Authenticated) | LocalTunnel |
|---------|----------------------|-------------|
| **Duration** | ⏰ 2 hours | ⏰ 60 minutes |
| **Reliability** | 🟢 High | 🟡 Medium |
| **Warning Page** | ❌ None | ⚠️ Yes |
| **HTTPS** | ✅ Always | ✅ Yes |
| **Custom Domain** | ✅ Available | ❌ Limited |
| **Authentication** | ✅ Token-based | ❌ Anonymous |
| **Speed** | 🚀 Fast | 🐌 Slower |
| **Professional Use** | ✅ Recommended | ❌ Not recommended |

## 🔄 Extending Demo Duration

### For Longer Demos:
1. **Re-run Workflow:** Simply trigger the workflow again for another 2 hours
2. **Local Setup:** Use `./simple-demo.sh` for unlimited local development
3. **Production Deployment:** Consider GitHub Pages for permanent hosting

### For Development:
```bash
# Clone repository
git clone https://github.com/aminchedo/legal_dashboard-srupper.git
cd legal_dashboard-srupper

# Run local demo
./simple-demo.sh
```

## 🎯 Next Steps

1. ✅ **Add the authtoken to GitHub Secrets** (follow steps above)
2. ✅ **Test the workflow** by running it manually
3. ✅ **Download and view the demo report**
4. ✅ **Share the live URL** with stakeholders
5. ✅ **Monitor the 2-hour live session**

---

### 📞 Support
If you encounter any issues:
1. Check the workflow logs in GitHub Actions
2. Verify all prerequisites are met
3. Ensure the authtoken is correctly configured
4. Review the troubleshooting section above

**🎬 Enjoy your professional ngrok live demo!**