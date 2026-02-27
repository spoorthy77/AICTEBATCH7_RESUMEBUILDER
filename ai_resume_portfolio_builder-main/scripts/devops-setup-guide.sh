#!/bin/bash

# DevOps Quick Start Guide
# This script provides step-by-step assistance for DevOps setup

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

print_section() {
    echo -e "\n${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

show_menu() {
    print_header "DevOps Setup Assistant"
    echo "Choose an option:"
    echo ""
    echo "  1) Show DevOps Overview"
    echo "  2) Setup Local Development"
    echo "  3) Deploy to Production"
    echo "  4) Start Monitoring Stack"
    echo "  5) Run Health Checks"
    echo "  6) Create Backup"
    echo "  7) View Documentation"
    echo "  8) View File Structure"
    echo "  9) Exit"
    echo ""
}

show_devops_overview() {
    print_header "DevOps Overview"
    
    cat << 'EOF'
AI Resume Portfolio Builder - Complete DevOps Setup

📦 CONTAINERIZATION
  ✓ Dockerfile (multi-stage build)
  ✓ docker-compose.yml (development)
  ✓ docker-compose.prod.yml (production)
  ✓ docker-compose.monitoring.yml (observability)
  ✓ .dockerignore (optimized builds)

🔧 CONFIGURATION
  ✓ Nginx reverse proxy & load balancer
  ✓ PostgreSQL database
  ✓ Redis cache
  ✓ Health checks for all services
  ✓ SSL/TLS support configured

🚀 CI/CD PIPELINES
  ✓ .github/workflows/ci-cd.yml (testing)
  ✓ .github/workflows/deploy.yml (deployment)
  ✓ .github/workflows/security.yml (scanning)
  ✓ .github/workflows/performance.yml (load testing)

📊 MONITORING & OBSERVABILITY
  ✓ Prometheus (metrics collection)
  ✓ Grafana (visualization)
  ✓ Alertmanager (alerts)
  ✓ Loki (log aggregation)
  ✓ Promtail (log shipping)

🤖 KUBERNETES
  ✓ Deployment manifests
  ✓ StatefulSets for databases
  ✓ Auto-scaling configuration
  ✓ Service discovery
  ✓ ConfigMaps & Secrets

📝 DOCUMENTATION
  ✓ DEVOPS.md (architecture)
  ✓ DEVOPS_DEPLOYMENT_GUIDE.md (deployment)
  ✓ DEVOPS_INFRASTRUCTURE.md (infrastructure)
  ✓ DEVOPS_CHECKLIST.md (checklist)

🛠️ AUTOMATION SCRIPTS
  ✓ scripts/deploy.sh (production deployment)
  ✓ scripts/setup-dev.sh (development setup)
  ✓ scripts/health-check.sh (health monitoring)
  ✓ scripts/backup.sh (data backup)
  ✓ scripts/restore.sh (data restoration)

EOF
}

setup_local_dev() {
    print_header "Local Development Setup"
    
    if [ ! -f .env ]; then
        print_section "Creating .env file..."
        cp .env.example .env
        print_success ".env file created"
        print_warning "Please update .env with your actual values"
    else
        print_info ".env file already exists"
    fi
    
    print_section "Installing dependencies..."
    if [ ! -d backend/venv ]; then
        cd backend
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ..
        print_success "Backend dependencies installed"
    else
        print_info "Backend virtual environment already exists"
    fi
    
    if [ ! -d frontend/node_modules ]; then
        cd frontend
        npm install
        cd ..
        print_success "Frontend dependencies installed"
    else
        print_info "Frontend dependencies already installed"
    fi
    
    print_section "Creating necessary directories..."
    mkdir -p generated_resumes logs nginx/ssl monitoring/grafana/provisioning
    print_success "Directories created"
    
    echo -e "\n${GREEN}✓ Development setup complete!${NC}"
    echo -e "\nTo start development:"
    echo -e "  ${BLUE}docker-compose up --build${NC}"
    echo -e "\nAccess:"
    echo -e "  Frontend: http://localhost:3000"
    echo -e "  Backend API: http://localhost:5000"
}

deploy_production() {
    print_header "Production Deployment"
    
    echo -e "${YELLOW}⚠ WARNING: This will deploy to PRODUCTION${NC}\n"
    
    read -p "Have you committed all changes to git? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        return
    fi
    
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        return
    fi
    
    print_section "Starting deployment..."
    chmod +x scripts/deploy.sh
    ./scripts/deploy.sh
}

start_monitoring() {
    print_header "Starting Monitoring Stack"
    
    print_section "Starting Prometheus, Grafana, Loki, and Alertmanager..."
    docker-compose -f docker-compose.monitoring.yml up -d
    
    print_success "Monitoring stack started"
    
    echo -e "\nAccess services:"
    echo -e "  ${BLUE}Prometheus: http://localhost:9090${NC}"
    echo -e "  ${BLUE}Grafana: http://localhost:3001${NC} (admin/admin)"
    echo -e "  ${BLUE}Alertmanager: http://localhost:9093${NC}"
    echo -e "  ${BLUE}Loki: http://localhost:3100${NC}"
    
    sleep 3
    echo -e "\n${GREEN}✓ Monitoring stack is running${NC}"
}

run_health_checks() {
    print_header "Service Health Checks"
    
    bash scripts/health-check.sh
}

create_backup() {
    print_header "Creating Backup"
    
    print_section "Creating backup of all data..."
    bash scripts/backup.sh
    
    echo -e "\n${GREEN}✓ Backup created successfully${NC}"
}

show_documentation() {
    print_header "Documentation Guide"
    
    cat << 'EOF'
Available Documentation Files:

1. DEVOPS.md
   - System architecture overview
   - Docker setup details
   - CI/CD pipeline explanation

2. DEVOPS_DEPLOYMENT_GUIDE.md
   - Complete deployment guide
   - Quick start instructions
   - Production deployment methods
   - Troubleshooting guide
   - Security considerations

3. DEVOPS_INFRASTRUCTURE.md
   - Infrastructure setup details
   - Component overview
   - Configuration details
   - Scaling procedures

4. DEVOPS_CHECKLIST.md
   - Pre/post deployment checklist
   - Security checklist
   - Maintenance schedule
   - Success criteria

Quick Access:
  cat DEVOPS.md                            # View architecture
  cat DEVOPS_DEPLOYMENT_GUIDE.md          # View deployment guide
  cat DEVOPS_INFRASTRUCTURE.md            # View infrastructure
  cat DEVOPS_CHECKLIST.md                 # View checklist

EOF
}

show_file_structure() {
    print_header "DevOps File Structure"
    
    cat << 'EOF'
.
├── .dockerignore
├── docker-compose.yml (development)
├── docker-compose.prod.yml (production)
├── docker-compose.monitoring.yml (monitoring)
├── Dockerfile
│
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       ├── default.conf
│       └── gzip.conf
│
├── monitoring/
│   ├── prometheus.yml
│   ├── alerts.yml
│   ├── alertmanager.yml
│   ├── loki-config.yml
│   └── promtail-config.yml
│
├── k8s/
│   ├── configmap.yml
│   ├── deployment.yml
│   ├── service.yml
│   └── autoscaling.yml
│
├── scripts/
│   ├── deploy.sh (production deployment)
│   ├── setup-dev.sh (development setup)
│   ├── health-check.sh (health monitoring)
│   ├── backup.sh (backup data)
│   └── restore.sh (restore from backup)
│
├── .github/workflows/
│   ├── ci-cd.yml (testing & building)
│   ├── deploy.yml (deployment)
│   ├── security.yml (security scanning)
│   └── performance.yml (performance testing)
│
└── Documentation/
    ├── DEVOPS.md (architecture)
    ├── DEVOPS_DEPLOYMENT_GUIDE.md (deployment)
    ├── DEVOPS_INFRASTRUCTURE.md (infrastructure)
    ├── DEVOPS_CHECKLIST.md (checklist)
    └── .env.example (environment template)

EOF
}

main() {
    while true; do
        show_menu
        read -p "Enter your choice (1-9): " choice
        
        case $choice in
            1) show_devops_overview ;;
            2) setup_local_dev ;;
            3) deploy_production ;;
            4) start_monitoring ;;
            5) run_health_checks ;;
            6) create_backup ;;
            7) show_documentation ;;
            8) show_file_structure ;;
            9) 
                echo -e "\n${GREEN}Goodbye!${NC}\n"
                exit 0 
                ;;
            *)
                echo -e "${RED}Invalid option. Please try again.${NC}"
                ;;
        esac
        
        read -p "\nPress Enter to continue..."
    done
}

# Run main function
main
