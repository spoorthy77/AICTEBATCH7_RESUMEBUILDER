#!/bin/bash

# Health Check Script

CONTAINERS=("ai-resume-portfolio-prod" "resume-postgres" "resume-redis" "resume-nginx")

echo "Checking container health status..."
echo "=================================="

for container in "${CONTAINERS[@]}"; do
    if docker ps --filter "name=$container" --filter "status=running" --quiet | grep -q .; then
        health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "No health check")
        echo "✓ $container: Running ($health_status)"
    else
        echo "✗ $container: Not running"
    fi
done

echo ""
echo "Checking services connectivity..."
echo "=================================="

# Check Flask app
if curl -s http://localhost/health > /dev/null; then
    echo "✓ Flask API: Responding"
else
    echo "✗ Flask API: Not responding"
fi

# Check Database
if docker exec -it resume-postgres pg_isready -U admin > /dev/null 2>&1; then
    echo "✓ PostgreSQL: Connected"
else
    echo "✗ PostgreSQL: Not accessible"
fi

# Check Redis
if docker exec -it resume-redis redis-cli ping > /dev/null 2>&1; then
    echo "✓ Redis: Connected"
else
    echo "✗ Redis: Not accessible"
fi

# Check Nginx
if curl -s http://localhost > /dev/null 2>&1; then
    echo "✓ Nginx: Responding"
else
    echo "✗ Nginx: Not responding"
fi
