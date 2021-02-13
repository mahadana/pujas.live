#!/bin/bash

set -Eeuo pipefail

trap '{ set +eu; rm -rf "$TEMP_BACKUP_DIR"; }' EXIT

echo "Backup start: $(date)"

S3_BUCKET="$(cat "$HOME/s3-bucket")"

RCLONE_BACKUP_DIR="s3:$S3_BUCKET/backups"
LATEST_DEST_PATH="$RCLONE_BACKUP_DIR/db/pujas.live-db-latest.sql.gz"
UPLOADS_SRC_DIR="/uploads"
UPLOADS_DEST_DIR="$RCLONE_BACKUP_DIR/uploads/$(date +%Y/%m)"
TEMP_BACKUP_DIR="$(mktemp -d)"
TEMP_BACKUP_PATH="$TEMP_BACKUP_DIR/pujas.live-db-latest.sql.gz"

rclone copyto "$LATEST_DEST_PATH" "$TEMP_BACKUP_PATH"
echo 'DROP DATABASE IF EXISTS strapi' | \
  PGPASSWORD=strapi psql -h postgres -U strapi -d postgres
echo 'CREATE DATABASE strapi' | \
  PGPASSWORD=strapi psql -h postgres -U strapi -d postgres
gunzip -c "$TEMP_BACKUP_PATH" | \
  PGPASSWORD=strapi psql -h postgres -U strapi -d strapi
rm -rf "$TEMP_BACKUP_DIR"

rclone copy "$UPLOADS_DEST_DIR/" "$UPLOADS_SRC_DIR/"

echo "Restore complete: $(date)"
