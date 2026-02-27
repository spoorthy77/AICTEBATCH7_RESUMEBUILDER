#!/bin/bash

# Backup script for production data

BACKUP_DIR="./backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

echo "Starting backup process..."

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
docker exec resume-postgres pg_dump -U admin resume_builder > "$BACKUP_DIR/db_$(date +%H%M%S).sql"
echo "✓ Database backup completed"

# Backup Redis
echo "Backing up Redis..."
docker exec resume-redis redis-cli BGSAVE
sleep 2
docker cp resume-redis:/data/dump.rdb "$BACKUP_DIR/redis_dump.rdb"
echo "✓ Redis backup completed"

# Backup application data
echo "Backing up application data..."
tar -czf "$BACKUP_DIR/app_data_$(date +%H%M%S).tar.gz" \
    generated_resumes/ \
    --exclude='*.tmp'
echo "✓ Application data backup completed"

echo ""
echo "All backups completed in: $BACKUP_DIR"
