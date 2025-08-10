#!/bin/bash

# Legal Dashboard Production Deployment Script
# Usage: ./deploy.sh [domain] [email]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DOMAIN=${1:-"your-domain.com"}
EMAIL=${2:-"your-email@example.com"}

echo -e "${BLUE}🚀 Legal Dashboard Production Deployment${NC}"
echo -e "${BLUE}==========================================${NC}"
echo -e "Domain: ${GREEN}$DOMAIN${NC}"
echo -e "Email: ${GREEN}$EMAIL${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    print_status "Checking Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Pull latest image
pull_image() {
    print_status "Pulling latest Docker image..."
    docker pull 24498743/legal-dashboard:latest
    print_success "Docker image pulled successfully"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p ssl certbot/www logs
    print_success "Directories created"
}

# Update configuration files
update_config() {
    print_status "Updating configuration files..."
    
    # Update .env file
    sed -i "s/your-domain.com/$DOMAIN/g" .env
    sed -i "s/your-email@example.com/$EMAIL/g" .env
    
    # Update nginx.conf
    sed -i "s/your-domain.com/$DOMAIN/g" nginx.conf
    
    # Update docker-compose.yml certbot command
    sed -i "s/your-email@example.com/$EMAIL/g" docker-compose.yml
    sed -i "s/your-domain.com/$DOMAIN/g" docker-compose.yml
    
    print_success "Configuration files updated"
}

# Generate strong secret key
generate_secret_key() {
    print_status "Generating strong secret key..."
    SECRET_KEY=$(openssl rand -hex 32)
    sed -i "s/your-super-secret-key-change-this-in-production-use-a-strong-random-key/$SECRET_KEY/g" .env
    print_success "Secret key generated"
}

# Start services
start_services() {
    print_status "Starting services..."
    docker-compose up -d
    print_success "Services started"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check if app is responding
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8000/health &> /dev/null; then
            print_success "Application is responding"
            break
        else
            print_warning "Attempt $attempt/$max_attempts: Application not ready yet..."
            sleep 10
            attempt=$((attempt + 1))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_error "Application failed to start properly"
        docker-compose logs app
        exit 1
    fi
}

# Setup SSL certificate
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    # Wait for nginx to be ready
    sleep 10
    
    # Get SSL certificate
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN
    
    if [ $? -eq 0 ]; then
        print_success "SSL certificate obtained successfully"
        
        # Reload nginx to use SSL
        docker-compose restart nginx
        print_success "Nginx restarted with SSL configuration"
    else
        print_warning "SSL certificate setup failed. You can retry later with:"
        echo "docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN"
    fi
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    docker-compose ps
    echo ""
    
    print_status "Service URLs:"
    echo -e "  🌐 Application: ${GREEN}http://$DOMAIN${NC}"
    echo -e "  🔒 Secure: ${GREEN}https://$DOMAIN${NC}"
    echo -e "  📚 API Docs: ${GREEN}https://$DOMAIN/docs${NC}"
    echo -e "  🏥 Health Check: ${GREEN}https://$DOMAIN/health${NC}"
    echo -e "  📊 Grafana: ${GREEN}http://localhost:3000${NC} (admin/admin_password_change_this)"
    echo -e "  📈 Prometheus: ${GREEN}http://localhost:9090${NC}"
    echo ""
    
    print_status "Useful Commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Update application: docker-compose pull && docker-compose up -d"
    echo "  Backup database: docker-compose exec db pg_dump -U legal_user legal_dashboard > backup.sql"
    echo ""
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting deployment process...${NC}"
    echo ""
    
    check_docker
    check_docker_compose
    pull_image
    create_directories
    update_config
    generate_secret_key
    start_services
    wait_for_services
    setup_ssl
    show_status
    
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo ""
    print_warning "Don't forget to:"
    echo "  1. Update your DNS records to point to this server"
    echo "  2. Change default passwords in .env file"
    echo "  3. Set up regular backups"
    echo "  4. Configure monitoring alerts"
    echo "  5. Set up SSL certificate auto-renewal"
}

# Run main function
main "$@"