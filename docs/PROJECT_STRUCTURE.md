# Project Structure Documentation

This document outlines the organized structure of the Legal Dashboard project, following industry best practices for maintainability, scalability, and security.

## 📁 Root Directory Structure

```
legal-dashboard/
├── 📁 frontend/                 # React/Vite frontend application
├── 📁 backend/                  # Node.js/Python backend services
├── 📁 api/                      # API routes and handlers
├── 📁 config/                   # Configuration files
├── 📁 scripts/                  # Utility and deployment scripts
├── 📁 docs/                     # Project documentation
├── 📁 deploy/                   # Deployment configurations
├── 📁 .temp-archive/            # Temporary files and backups
├── 📄 package.json              # Root package configuration
├── 📄 README.md                 # Project overview and quick start
├── 📄 .gitignore                # Version control exclusions
└── 📄 .cursorrules              # Development environment rules
```

## 📁 Frontend Directory (`frontend/`)

**Purpose**: React-based user interface with TypeScript and Vite

```
frontend/
├── 📁 src/                      # Source code
│   ├── 📁 components/           # Reusable UI components
│   ├── 📁 pages/                # Page components
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 services/             # API service layer
│   ├── 📁 utils/                # Utility functions
│   ├── 📁 types/                # TypeScript type definitions
│   ├── 📁 contexts/             # React contexts
│   └── 📁 assets/               # Static assets (images, icons)
├── 📁 public/                   # Public static files
├── 📁 scripts/                  # Frontend-specific scripts
├── 📄 package.json              # Frontend dependencies
├── 📄 vite.config.ts            # Vite configuration
├── 📄 tailwind.config.js        # Tailwind CSS configuration
├── 📄 tsconfig.json             # TypeScript configuration
└── 📄 index.html                # Entry HTML file
```

## 📁 Backend Directory (`backend/`)

**Purpose**: Server-side application logic with Node.js and Python

```
backend/
├── 📁 src/                      # Source code
│   ├── 📁 controllers/          # Request handlers
│   ├── 📁 models/               # Data models
│   ├── 📁 middleware/           # Express middleware
│   ├── 📁 routes/               # API route definitions
│   ├── 📁 services/             # Business logic
│   ├── 📁 utils/                # Utility functions
│   └── 📁 types/                # TypeScript type definitions
├── 📁 database/                 # Database schemas and migrations
├── 📁 python/                   # Python scripts and utilities
├── 📄 package.json              # Backend dependencies
├── 📄 requirements.txt          # Python dependencies
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 server.js                 # Main server entry point
└── 📄 init-db.sql               # Database initialization
```

## 📁 API Directory (`api/`)

**Purpose**: API route definitions and handlers

```
api/
├── 📁 auth/                     # Authentication endpoints
├── 📁 dashboard/                # Dashboard data endpoints
├── 📁 documents/                # Document management endpoints
├── 📁 analytics/                # Analytics endpoints
├── 📁 scraping/                 # Web scraping endpoints
└── 📁 websocket/                # WebSocket handlers
```

## 📁 Config Directory (`config/`)

**Purpose**: Configuration files for different environments

```
config/
├── 📄 nginx.conf                # Nginx server configuration
├── 📄 database.config.js        # Database configuration
├── 📄 security.config.js        # Security settings
└── 📄 environment.config.js     # Environment-specific configs
```

## 📁 Scripts Directory (`scripts/`)

**Purpose**: Automation scripts for development and deployment

```
scripts/
├── 📁 deployment/               # Deployment automation
│   ├── 📄 deploy.sh             # Main deployment script
│   ├── 📄 docker-deploy.sh      # Docker deployment
│   ├── 📄 deploy-vercel.sh      # Vercel deployment
│   └── 📄 monitor-deployment.sh # Deployment monitoring
├── 📄 test-application.sh       # Full application testing
├── 📄 test-local.sh             # Local development testing
├── 📄 get-docker.sh             # Docker setup script
├── 📄 simple-demo.sh            # Demo script
└── 📄 record_demo.sh            # Demo recording script
```

## 📁 Docs Directory (`docs/`)

**Purpose**: Comprehensive project documentation

```
docs/
├── 📁 deployment/               # Deployment guides
│   ├── 📄 deployment-guide.md   # Main deployment guide
│   ├── 📄 DOCKER_DEPLOYMENT_GUIDE.md
│   ├── 📄 README-DEPLOYMENT.md
│   ├── 📄 SECURE_CI_CD_README.md
│   └── 📄 vercel-docker-alternative.md
├── 📁 development/              # Development notes
│   ├── 📄 DASHBOARD_IMPROVEMENTS.md
│   ├── 📄 DEPLOYMENT_READY.md
│   ├── 📄 DEPLOYMENT_SUMMARY.md
│   ├── 📄 DOCUMENT_MANAGEMENT_ENHANCEMENT_COMPLETE.md
│   └── 📄 VERCEL_FIXES_SUMMARY.md
├── 📁 guides/                   # User and setup guides
│   ├── 📄 NGROK_IMPLEMENTATION_SUMMARY.md
│   ├── 📄 NGROK_SETUP_INSTRUCTIONS.md
│   ├── 📄 QUICK_START_NGROK.md
│   └── 📄 TESTING_COMMANDS.md
└── 📄 PROJECT_STRUCTURE.md      # This file
```

## 📁 Deploy Directory (`deploy/`)

**Purpose**: Deployment configurations and manifests

```
deploy/
├── 📄 docker-compose.yml        # Development Docker Compose
├── 📄 docker-compose.production.yml # Production Docker Compose
├── 📄 Dockerfile                # Docker image definition
├── 📄 .dockerignore             # Docker build exclusions
└── 📄 .vercelignore             # Vercel deployment exclusions
```

## 📁 Temp Archive Directory (`.temp-archive/`)

**Purpose**: Temporary files, backups, and artifacts (excluded from version control)

```
.temp-archive/
├── 📁 backups/                  # Backup directories
│   ├── 📁 src_backup_20250814_080402/
│   └── 📁 components_backup_20250814_080402/
├── 📁 logs/                     # Log files
│   ├── 📄 backend.log
│   ├── 📄 frontend.log
│   └── 📄 scrapers_npm_install.log
└── 📁 artifacts/                # Build artifacts
    ├── 📁 backend-dist/
    └── 📁 frontend-dist/
```

## 🔧 Key Configuration Files

### Root Level
- `package.json` - Root package configuration and scripts
- `.gitignore` - Version control exclusions
- `.cursorrules` - Development environment configuration
- `vercel.json` - Vercel deployment configuration

### Frontend
- `frontend/vite.config.ts` - Vite build configuration
- `frontend/tailwind.config.js` - Tailwind CSS configuration
- `frontend/tsconfig.json` - TypeScript configuration

### Backend
- `backend/package.json` - Backend dependencies
- `backend/requirements.txt` - Python dependencies
- `backend/tsconfig.json` - TypeScript configuration
- `backend/server.js` - Main server entry point

### Deployment
- `deploy/docker-compose.yml` - Docker Compose configuration
- `deploy/Dockerfile` - Docker image definition
- `config/nginx.conf` - Nginx server configuration

## 🚀 Development Workflow

1. **Setup**: Use scripts in `scripts/` directory for initial setup
2. **Development**: Run frontend and backend in separate terminals
3. **Testing**: Use test scripts in `scripts/` directory
4. **Deployment**: Use deployment scripts in `scripts/deployment/`
5. **Documentation**: Update relevant files in `docs/` directory

## 🔒 Security Considerations

- Environment variables for sensitive configuration
- Secure deployment practices documented in `docs/deployment/`
- Input validation and sanitization
- CORS configuration
- Database security practices

## 📝 Maintenance Guidelines

1. **Keep temporary files in `.temp-archive/`**
2. **Update documentation for structural changes**
3. **Use provided scripts for common tasks**
4. **Follow established naming conventions**
5. **Maintain separation of concerns**

This structure promotes:
- **Modularity**: Clear separation between frontend, backend, and configuration
- **Scalability**: Easy to add new features and services
- **Maintainability**: Organized code and documentation
- **Security**: Proper configuration management
- **Deployment**: Streamlined deployment processes