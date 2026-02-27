#!/bin/bash

# Restore backup script

if [ $# -eq 0 ]; then
    echo "Usage: ./restore.sh <backup_directory>"
    echo "Example: ./restore.sh ./backups/20240227"
    exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Error: Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "Warning: This will overwrite current data!"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo "Restoring from backup: $BACKUP_DIR"

# Restore PostgreSQL
if [ -f "$BACKUP_DIR"/db_*.sql ]; then
    echo "Restoring PostgreSQL..."
    docker exec -i resume-postgres psql -U admin resume_builder < "$BACKUP_DIR"/db_*.sql
    echo "✓ Database restored"
fi

# Restore Redis
if [ -f "$BACKUP_DIR/redis_dump.rdb" ]; then
    echo "Restoring Redis..."
    docker cp "$BACKUP_DIR/redis_dump.rdb" resume-redis:/data/dump.rdb
    docker exec resume-redis redis-cli SHUTDOWN
    sleep 2
    docker restart resume-redis
    echo "✓ Redis restored"
fi

# Restore application data
if [ -f "$BACKUP_DIR"/app_data_*.tar.gz ]; then
    echo "Restoring application data..."
    tar -xzf "$BACKUP_DIR"/app_data_*.tar.gz
    echo "✓ Application data restored"
fi

echo "Restore completed!"
