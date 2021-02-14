#!/bin/bash

set -Eeuo pipefail

if [ "$(id -nu)" != "backy" ]; then
  exec su -c "bash $0" backy
  exit 0
fi

RCLONE_OPTIONS="--verbose --tpslimit 20 --fast-list"
S3_BUCKET="$(cat "$HOME/s3-bucket")"
S3_BACKUP_DIR="s3:$S3_BUCKET/backups"
S3_UPLOADS_DIR="s3:$S3_BUCKET/uploads"

S3_BACKUP_LATEST_DB_PATH="$S3_BACKUP_DIR/db/pujas.live-db-latest.sql.gz"
S3_BACKUP_UPLOADS_DIR="$S3_BACKUP_DIR/uploads/$(date +%Y/%m)"

echo "Restore start..."

trap '{ set +eu; rm -f "$TEMP_BACKUP_PATH"; }' EXIT

TEMP_BACKUP_PATH="$(mktemp)"

echo "Downloading database from $S3_BACKUP_LATEST_DB_PATH"
rclone copyto "$S3_BACKUP_LATEST_DB_PATH" "$TEMP_BACKUP_PATH"

echo "Removing existing database"
echo 'DROP DATABASE IF EXISTS strapi' | \
  PGPASSWORD=strapi psql -h postgres -U strapi -d postgres

echo "Creating new database"
echo 'CREATE DATABASE strapi' | \
  PGPASSWORD=strapi psql -h postgres -U strapi -d postgres

echo "Restoring database"
gunzip -c "$TEMP_BACKUP_PATH" | \
  PGPASSWORD=strapi psql -h postgres -U strapi -d strapi

rm -f "$TEMP_BACKUP_PATH"

echo "Copying $S3_BACKUP_UPLOADS_DIR to $S3_UPLOADS_DIR"
rclone copy $RCLONE_OPTIONS --s3-acl="public-read" \
  "$S3_BACKUP_UPLOADS_DIR/" "$S3_UPLOADS_DIR/"

echo "Restore complete!"
