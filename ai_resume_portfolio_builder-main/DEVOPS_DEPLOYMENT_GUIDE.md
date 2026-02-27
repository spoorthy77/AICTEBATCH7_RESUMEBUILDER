# DevOps Deployment Guide

Complete guide for deploying and managing the AI Resume Portfolio Builder application.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [Container Management](#container-management)
5. [Monitoring & Logging](#monitoring--logging)
6. [Backup & Recovery](#backup--recovery)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.10+ (for local development)
- Git

### Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd ai_resume_portfolio_builder-main

# Run setup script (Linux/macOS)
bash scripts/setup-dev.sh

# Start development environment
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Nginx: http://localhost:80
```

### Production Deployment

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

---

## Local Development

### Docker Compose Development

```bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f app

# Access container shell
docker-compose exec app bash
```

### Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update with your values:
- `FLASK_ENV=development`
- `FLASK_DEBUG=True`
- `SECRET_KEY=your-dev-secret`
- `GROK_API_KEY=your-api-key`
- `OPENAI_API_KEY=your-api-key`
- `REACT_APP_API_URL=http://localhost:5000/api`

### Database Setup

For local development (SQLite):
```bash
# Migrations handled automatically by Flask
# Database file: `resume_builder.db`
```

---

## Production Deployment

### Pre-deployment Checklist

- [ ] All code committed and pushed to main branch
- [ ] Environment variables configured in `.env`
- [ ] Secrets added to GitHub Actions (if using CI/CD)
- [ ] Backups taken of existing data
- [ ] Health checks configured
- [ ] SSL certificates prepared (for HTTPS)
- [ ] Domain configured and pointing to server

### Deployment Methods

#### Method 1: Automated Deployment Script (Recommended)

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment with automatic rollback on failure
./scripts/deploy.sh

# The script will:
# ✓ Check prerequisites
# ✓ Create backup
# ✓ Pull latest code
# ✓ Build Docker images
# ✓ Start containers
# ✓ Run health checks
# ✓ Run database migrations
# ✓ Verify all services
# ✓ Cleanup old backups
```

#### Method 2: Docker Compose Production

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

#### Method 3: Manual Deployment

```bash
# Build Docker image
docker build -t ai-resume-portfolio:latest .

# Run container
docker run -d \
  --name ai-resume-app \
  -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/generated_resumes:/app/generated_resumes \
  ai-resume-portfolio:latest
```

### Database Configuration

#### PostgreSQL (Production)

```bash
# Connect to PostgreSQL
docker exec -it resume-postgres psql -U admin -d resume_builder

# Common commands
\dt                    # List tables
\du                    # List users
\q                     # Quit
```

#### Run Migrations

```bash
docker-compose -f docker-compose.prod.yml exec app \
  python -m flask db upgrade
```

---

## Container Management

### Service Status

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check specific service logs
docker-compose -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.prod.yml logs app
docker-compose -f docker-compose.prod.yml logs postgres
```

### Scaling Services

```bash
# Scale app service to 3 instances (requires load balancer)
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Container Inspection

```bash
# View container details
docker inspect resume-postgres

# View resource usage
docker stats resume-postgres

# View container events
docker events --filter container=resume-postgres
```

### Updating Services

```bash
# Update single service
docker-compose -f docker-compose.prod.yml up -d app --build

# Update all services
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Monitoring & Logging

### Health Checks

```bash
# Run health check script
bash scripts/health-check.sh

# Output shows status of all services:
# ✓ ai-resume-portfolio-prod: Running
# ✓ resume-postgres: Connected
# ✓ resume-redis: Connected
# ✓ resume-nginx: Responding
```

### Log Management

```bash
# View application logs
docker-compose logs app --tail=100

# View Nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# View Nginx error logs
docker-compose exec nginx tail -f /var/log/nginx/error.log

# View PostgreSQL logs
docker-compose exec postgres tail -f /var/log/postgresql/postgresql.log

# Export logs to file
docker-compose logs > logs/docker-compose.log
```

### Performance Monitoring

```bash
# Monitor container CPU and memory
watch docker stats

# View detailed metrics
docker stats --no-stream
```

---

## Backup & Recovery

### Automated Backups

```bash
# Create backup
bash scripts/backup.sh

# Backups created in: ./backups/YYYYMMDD/
# - db_HHMMSS.sql       (PostgreSQL dump)
# - redis_dump.rdb      (Redis backup)
# - app_data_HHMMSS.tar.gz (Application files)
```

### Scheduled Backups (Cron)

```bash
# Run daily backup at 2 AM
0 2 * * * /path/to/project/scripts/backup.sh

# Run weekly full backup
0 2 * * 0 /path/to/project/scripts/backup.sh
```

### Restore from Backup

```bash
# List available backups
ls -la ./backups/

# Restore from specific backup
bash scripts/restore.sh ./backups/20240227

# The script will restore:
# - PostgreSQL data
# - Redis cache
# - Application data
```

### Manual Database Backup

```bash
# PostgreSQL backup
docker exec resume-postgres pg_dump -U admin resume_builder > backup.sql

# PostgreSQL restore
docker exec -i resume-postgres psql -U admin resume_builder < backup.sql

# Redis backup
docker exec resume-redis redis-cli BGSAVE
docker cp resume-redis:/data/dump.rdb ./redis-backup.rdb

# Redis restore
docker cp ./redis-backup.rdb resume-redis:/data/dump.rdb
docker exec resume-redis redis-cli SHUTDOWN
docker restart resume-redis
```

---

## Troubleshooting

### Common Issues

#### Application won't start
```bash
# Check logs
docker-compose logs app

# Check if port 5000 is in use
sudo lsof -i :5000

# Reset containers
docker-compose down -v
docker-compose up --build
```

#### PostgreSQL connection errors
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Verify network connectivity
docker-compose exec app ping postgres

# Reset PostgreSQL
docker-compose down -v postgres
docker-compose up -d postgres
```

#### Nginx not reverse proxying correctly
```bash
# Check Nginx configuration
docker exec resume-nginx nginx -t

# Reload Nginx configuration
docker exec resume-nginx nginx -s reload

# Check upstream connectivity
docker-compose exec nginx ping app:5000
```

#### Out of disk space
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

#### Memory issues
```bash
# Check container memory limits
docker stats

# Increase Docker memory limit (Docker Desktop)
# Settings → Resources → Memory slider

# Update docker-compose resource limits
# services:
#   app:
#     deploy:
#       resources:
#         limits:
#           memory: 2G
```

### Debug Mode

```bash
# Start with debug output
FLASK_DEBUG=1 docker-compose up

# Enable verbose logging
docker-compose --verbose up

# Access container shell
docker-compose exec app bash
python
>>> # Use Python REPL to test
```

---

## Security Considerations

### Environment Variables

- ✓ Store sensitive data in `.env` (add to `.gitignore`)
- ✗ Never commit `.env` to repository
- ✗ Never share `.env` file
- Use strong, random `SECRET_KEY`

### SSL/HTTPS Setup

```bash
# Generate self-signed certificate (testing only)
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# For production, use Let's Encrypt:
# https://letsencrypt.org/getting-started/

# Place certificates in ./nginx/ssl/
# Uncomment HTTPS configuration in nginx/conf.d/default.conf
```

### Docker Security

```bash
# Scan images for vulnerabilities
docker scan ai-resume-portfolio:latest

# Use Trivy for detailed scanning
trivy image ai-resume-portfolio:latest

# Run container as non-root user
# (Already configured in Dockerfile)
```

### Network Security

- Use private Docker network (`app-network`)
- Expose only necessary ports (80, 443)
- Set firewall rules to restrict access
- Use strong database passwords
- Enable Redis persist with append-only file

### Best Practices

1. **Regular Updates**
   ```bash
   docker pull python:3.11-slim
   docker pull nginx:alpine
   docker pull postgres:15-alpine
   docker pull redis:7-alpine
   ```

2. **Regular Backups**
   - Automate backup schedule
   - Test restore procedures
   - Store backups securely

3. **Monitoring**
   - Set up log aggregation
   - Configure alerts
   - Monitor resource usage

4. **Access Control**
   - Use SSH keys for git deployment
   - Restrict admin access
   - Use strong passwords
   - Enable 2FA for critical services

---

## Advanced Topics

### Load Balancing

```bash
# Scale app with multiple instances
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Nginx will automatically load balance between instances
```

### CI/CD Pipeline

```bash
# GitHub Actions workflows configured in .github/workflows/
# - ci-cd.yml: Tests and security scanning
# - deploy.yml: Automated production deployment
```

### Kubernetes Deployment (Optional)

For production at scale, consider Kubernetes:

```bash
# See k8s/ directory for Kubernetes manifests
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
```

---

## Support & Maintenance

### Regular Maintenance Tasks

```bash
# Weekly
- Run health checks: bash scripts/health-check.sh
- Review logs
- Check disk space

# Monthly
- Update base images
- Run backups
- Test restore procedure
- Review security

# Quarterly
- Dependency updates
- Performance review
- Disaster recovery drill
```

### Getting Help

- Check logs: `docker-compose logs`
- Run health check: `bash scripts/health-check.sh`
- Review this guide
- Check GitHub Issues
- Contact DevOps team

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `docker-compose up` | Start dev environment |
| `docker-compose down` | Stop containers |
| `./scripts/deploy.sh` | Deploy to production |
| `bash scripts/health-check.sh` | Check service health |
| `bash scripts/backup.sh` | Backup all data |
| `bash scripts/restore.sh ./backups/DIR` | Restore from backup |
| `docker-compose logs -f app` | View app logs |
| `docker stats` | Monitor resources |
| `docker system prune` | Clean up Docker |

---

Last Updated: February 27, 2024
For more information, see DEVOPS.md
