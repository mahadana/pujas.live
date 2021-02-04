#!/bin/bash

set -Eeuo pipefail

trap '{ set +eu; rm -rf "$TEMP_BACKUP_DIR"; }' EXIT

echo "Backup start: $(date)"

S3_BUCKET="$(cat "$HOME/s3-bucket")"

BACKUP_FILE="pujas.live-db-$(date +%Y-%m-%d).sql.gz"
RCLONE_BACKUP_DIR="s3:$S3_BUCKET/backups"
DB_DEST_PATH="$RCLONE_BACKUP_DIR/db/$(date +%Y/%m)/$BACKUP_FILE"
UPLOADS_SRC_DIR="/uploads"
UPLOADS_DEST_DIR="$RCLONE_BACKUP_DIR/uploads/$(date +%Y/%m)"
TEMP_BACKUP_DIR="$(mktemp -d)"
TEMP_BACKUP_PATH="$TEMP_BACKUP_DIR/$BACKUP_FILE"

PGPASSWORD=strapi pg_dump -h postgres -U strapi -d strapi | \
  gzip > "$TEMP_BACKUP_PATH"
rclone copyto --s3-acl="private" "$TEMP_BACKUP_PATH" "$DB_DEST_PATH"
rm -rf "$TEMP_BACKUP_DIR"

rclone copy --s3-acl="public-read" "$UPLOADS_SRC_DIR/" "$UPLOADS_DEST_DIR/"

echo "Backup complete: $(date)"
