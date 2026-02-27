# DevOps Infrastructure Setup Guide

## Overview

This directory contains comprehensive DevOps configurations for production-grade deployment of the AI Resume Portfolio Builder.

## Directory Structure

```
├── .dockerignore              # Files to exclude from Docker builds
├── docker-compose.yml         # Local development environment
├── docker-compose.prod.yml    # Production environment
├── docker-compose.monitoring.yml # Monitoring & observability stack
├── Dockerfile                 # Application container image
├── nginx/                     # Nginx reverse proxy configuration
│   ├── nginx.conf
│   ├── conf.d/
│   │   ├── default.conf
│   │   └── gzip.conf
│   └── ssl/                   # SSL certificates
├── monitoring/                # Prometheus, Grafana, Loki setup
│   ├── prometheus.yml
│   ├── alerts.yml
│   ├── alertmanager.yml
│   ├── loki-config.yml
│   └── promtail-config.yml
├── k8s/                       # Kubernetes manifests
│   ├── configmap.yml
│   ├── deployment.yml
│   ├── service.yml
│   └── autoscaling.yml
├── scripts/                   # Automation scripts
│   ├── deploy.sh
│   ├── setup-dev.sh
│   ├── health-check.sh
│   ├── backup.sh
│   └── restore.sh
├── DEVOPS.md                  # Architecture documentation
├── DEVOPS_DEPLOYMENT_GUIDE.md # Complete deployment guide
└── DEVOPS_INFRASTRUCTURE.md   # This file
```

## Quick Setup

### 1. Local Development

```bash
# Setup development environment
bash scripts/setup-dev.sh

# Start services
docker-compose up --build
```

### 2. Production Deployment

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to production
./scripts/deploy.sh
```

### 3. Monitoring Setup

```bash
# Start monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# Access services:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001
# Alertmanager: http://localhost:9093
# Loki: http://localhost:3100
```

### 4. Kubernetes Deployment

```bash
# Create namespace and deploy
kubectl create namespace resume-builder
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
kubectl apply -f k8s/autoscaling.yml
```

## Key Components

### Services

| Service | Purpose | Port |
|---------|---------|------|
| Flask App | REST API backend | 5000 |
| Nginx | Reverse proxy & load balancer | 80, 443 |
| PostgreSQL | Primary database | 5432 |
| Redis | Cache & session store | 6379 |

### Monitoring & Observability

| Service | Purpose | Port |
|---------|---------|------|
| Prometheus | Metrics collection | 9090 |
| Grafana | Visualization dashboard | 3001 |
| Alertmanager | Alert routing | 9093 |
| Loki | Log aggregation | 3100 |
| Promtail | Log shipping | - |

## Configuration Files

### Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

### SSL/TLS Certificates

For production HTTPS:

```bash
# Generate self-signed certificate (testing)
openssl req -x509 -newkey rsa:4096 -nodes \
  -out nginx/ssl/cert.pem -keyout nginx/ssl/key.pem -days 365

# Or use Let's Encrypt (production)
certbot certonly --standalone -d your-domain.com
```

## Deployment Strategies

### Strategy 1: Docker Compose (Recommended for small deployments)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Pros:**
- Simple setup
- Easy maintenance
- Suitable for single servers

**Cons:**
- Limited scaling
- Single point of failure

### Strategy 2: Kubernetes (Recommended for scale)

```bash
kubectl apply -f k8s/
```

**Pros:**
- Auto-scaling
- Self-healing
- Service discovery

**Cons:**
- Complexity
- Learning curve

### Strategy 3: Manual Deployment

```bash
docker build -t app:latest .
docker run -d --env-file .env app:latest
```

## Monitoring & Alerts

### Key Metrics

- HTTP request rates and latencies
- Error rates
- Database performance
- Memory and CPU usage
- Redis cache hit ratio
- Disk space usage

### Alert Rules

Configured in `monitoring/alerts.yml`:

- High error rate (>10%)
- High memory usage (>90%)
- High CPU usage (>80%)
- Container down
- Database connection errors
- Redis down
- Low disk space (<10%)
- High response time (>1s)

### Viewing Metrics

```bash
# Prometheus
curl http://localhost:9090/api/v1/query?query=up

# Grafana dashboards
# Access: http://localhost:3001
# Default: admin/admin

# Logs in Loki
# Query: {job="flask-app"}
```

## Scaling

### Horizontal Scaling

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Kubernetes
kubectl scale deployment resume-app --replicas=5
```

### Auto-scaling (Kubernetes)

```bash
kubectl apply -f k8s/autoscaling.yml

# Check HPA status
kubectl get hpa
```

## Backup & Recovery

### Automated Backups

```bash
# Create backup
bash scripts/backup.sh

# Restore from backup
bash scripts/restore.sh ./backups/20240227
```

### Manual Backups

```bash
# PostgreSQL
docker exec postgres pg_dump -U admin > backup.sql

# Redis
docker exec redis redis-cli BGSAVE
```

## Security Practices

1. **Environment Variables**
   - Store secrets in `.env` (not committed)
   - Use strong random values
   - Rotate regularly

2. **Container Security**
   - Scan images: `docker scan image:tag`
   - Use minimal base images
   - Run as non-root user

3. **Network Security**
   - Use private Docker networks
   - Expose only necessary ports
   - Configure firewall rules
   - Use SSL/TLS for HTTPS

4. **Database Security**
   - Strong PostgreSQL passwords
   - Encrypted connections
   - Regular backups
   - Access control

## Troubleshooting

### Common Issues

```bash
# Check logs
docker-compose logs -f app

# Health check
bash scripts/health-check.sh

# Container stats
docker stats

# Network issues
docker-compose exec app ping postgres
```

### Performance Optimization

```bash
# Monitor resource usage
docker stats --no-stream

# Check database query performance
docker exec -it postgres psql -U admin -d resume_builder
SELECT * FROM pg_stat_statements;

# Redis memory usage
docker exec -it redis redis-cli INFO memory

# Nginx cache hit ratio
docker exec -it nginx tail -f /var/log/nginx/access.log
```

## Maintenance

### Regular Tasks

- **Daily:** Monitor logs and alerts
- **Weekly:** Health checks, review metrics
- **Monthly:** Dependency updates, backups
- **Quarterly:** Security updates, disaster recovery test

### Cleanup

```bash
# Remove old backups
find ./backups -type f -mtime +30 -delete

# Remove unused Docker images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean up logs
find ./logs -type f -mtime +7 -delete
```

## Documentation References

- [DEVOPS.md](DEVOPS.md) - System architecture
- [DEVOPS_DEPLOYMENT_GUIDE.md](DEVOPS_DEPLOYMENT_GUIDE.md) - Detailed deployment guide
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs and alerts
3. Run health checks
4. Consult the deployment guide

---

Last Updated: February 27, 2024
