#!/bin/bash

# DevOps Deployment Script for AI Resume Portfolio Builder
# This script handles production deployment with health checks and rollback capability

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="$PROJECT_ROOT/.backups"
LOG_FILE="$PROJECT_ROOT/logs/deployment.log"
DEPLOYMENT_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="backup_$DEPLOYMENT_TIMESTAMP"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}✗ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='__pycache__' \
        --exclude='.backups' \
        --exclude='logs' \
        -C "$PROJECT_ROOT" . 2>/dev/null
    
    success "Backup created: $BACKUP_NAME"
}

# Stop current containers
stop_containers() {
    log "Stopping current containers..."
    docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" down || true
    success "Containers stopped"
}

# Pull latest code
pull_latest() {
    log "Pulling latest code from repository..."
    cd "$PROJECT_ROOT"
    git fetch origin
    git pull origin main
    success "Code updated"
}

# Build and start containers
build_and_start() {
    log "Building and starting containers..."
    cd "$PROJECT_ROOT"
    
    docker-compose -f docker-compose.prod.yml up -d --build
    
    if [ $? -eq 0 ]; then
        success "Containers built and started"
    else
        error "Failed to build containers"
        rollback_deployment
        exit 1
    fi
}

# Health checks
run_health_checks() {
    log "Running health checks..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost/health &> /dev/null; then
            success "Health check passed"
            return 0
        fi
        
        attempt=$((attempt + 1))
        warning "Waiting for service to be ready... (attempt $attempt/$max_attempts)"
        sleep 2
    done
    
    error "Health check failed after $max_attempts attempts"
    rollback_deployment
    exit 1
}

# Run database migrations (if any)
run_migrations() {
    log "Running database migrations..."
    
    docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" exec -T app \
        python -m flask db upgrade 2>/dev/null || true
    
    success "Migrations completed"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    local services=("app" "nginx" "postgres" "redis")
    
    for service in "${services[@]}"; do
        if docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" ps "$service" | grep -q "Up"; then
            success "$service is running"
        else
            error "$service is not running"
            rollback_deployment
            exit 1
        fi
    done
    
    success "All services are running"
}

# Rollback deployment
rollback_deployment() {
    error "Deployment failed, rolling back..."
    
    docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" down
    
    if [ -f "$BACKUP_DIR/$BACKUP_NAME.tar.gz" ]; then
        log "Extracting backup..."
        tar -xzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$PROJECT_ROOT"
        
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" up -d
        
        success "Rollback completed"
    else
        error "Rollback failed: backup file not found"
        exit 1
    fi
}

# Cleanup old backups (keep last 5)
cleanup_old_backups() {
    log "Cleaning up old backups (keeping last 5)..."
    
    cd "$BACKUP_DIR"
    ls -1tr *.tar.gz 2>/dev/null | head -n -5 | xargs -r rm
    
    success "Backup cleanup completed"
}

# Main deployment flow
main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     AI Resume Portfolio Builder - Deployment Script     ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    mkdir -p "$PROJECT_ROOT/logs"
    
    check_prerequisites
    create_backup
    stop_containers
    pull_latest
    build_and_start
    sleep 5  # Wait for services to initialize
    run_migrations
    run_health_checks
    verify_deployment
    cleanup_old_backups
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           Deployment completed successfully!            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    
    log "Deployment finished at $(date)"
}

# Execute main function
main "$@"
