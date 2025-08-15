# Legal Dashboard

A full-stack legal document management and analytics dashboard with secure deployment capabilities.

## 🏗️ Project Structure

```
legal-dashboard/
├── 📁 frontend/                 # React/Vite frontend application
│   ├── src/                    # Source code
│   ├── public/                 # Static assets
│   └── package.json           # Frontend dependencies
├── 📁 backend/                 # Node.js/Python backend services
│   ├── src/                   # Backend source code
│   ├── database/              # Database schemas and migrations
│   └── package.json          # Backend dependencies
├── 📁 api/                    # API routes and handlers
├── 📁 config/                 # Configuration files
│   └── nginx.conf            # Nginx configuration
├── 📁 scripts/                # Utility and deployment scripts
│   ├── deployment/           # Deployment automation scripts
│   └── *.sh                  # Development and testing scripts
├── 📁 docs/                   # Project documentation
│   ├── deployment/           # Deployment guides
│   ├── development/          # Development notes
│   └── guides/               # User and setup guides
├── 📁 deploy/                 # Deployment configurations
├── 📁 .temp-archive/          # Temporary files and backups
│   ├── backups/              # Backup directories
│   ├── logs/                 # Log files
│   └── artifacts/            # Build artifacts
└── 📄 package.json           # Root package configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- Python 3.8+
- Docker (for containerized deployment)

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Start Development Servers**
   ```bash
   # Start frontend
   npm run dev
   
   # Start backend (in separate terminal)
   cd backend && npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📚 Documentation

- **Deployment Guides**: `docs/deployment/`
- **Development Notes**: `docs/development/`
- **User Guides**: `docs/guides/`

## 🔧 Scripts

### Development
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run start` - Start frontend production server

### Deployment
- `scripts/deployment/deploy.sh` - Deploy to production
- `scripts/deployment/docker-deploy.sh` - Docker deployment
- `scripts/deployment/monitor-deployment.sh` - Monitor deployment status

### Testing
- `scripts/test-application.sh` - Run full application tests
- `scripts/test-local.sh` - Run local development tests

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Python, Express
- **Database**: SQLite/PostgreSQL
- **Deployment**: Docker, Vercel, Nginx
- **CI/CD**: GitHub Actions

## 🔒 Security

- Environment variables for sensitive configuration
- Secure deployment practices
- Input validation and sanitization
- CORS configuration

## 📝 Contributing

1. Follow the established project structure
2. Use the provided scripts for testing and deployment
3. Update documentation for any structural changes
4. Keep temporary files in `.temp-archive/` directory

## 📄 License

This project is proprietary and confidential.