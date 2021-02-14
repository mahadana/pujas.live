#!/bin/bash

set -Eeuo pipefail

if [ "$(id -nu)" != "backy" ]; then
  exec su -c "bash $0" backy
  exit 0
fi

LOG_DIR="/logs/backups"
LOG_PATH="$LOG_DIR/backup-$(date +%Y-%m-%d).log"
mkdir -p "$LOG_DIR"

(
  RCLONE_OPTIONS="--verbose --tpslimit 20 --fast-list"
  S3_BUCKET="$(cat "$HOME/s3-bucket")"
  S3_BACKUP_DIR="s3:$S3_BUCKET/backups"
  S3_UPLOADS_DIR="s3:$S3_BUCKET/uploads"

  S3_BACKUP_DB_PATH="$S3_BACKUP_DIR/db/$(date +%Y/%m)/pujas.live-db-$(date +%Y-%m-%d).sql.gz"
  S3_BACKUP_LATEST_DB_PATH="$S3_BACKUP_DIR/db/pujas.live-db-latest.sql.gz"
  S3_BACKUP_UPLOADS_DIR="$S3_BACKUP_DIR/uploads/$(date +%Y/%m)"

  echo "Backup start..."

  trap '{ set +eu; rm -f "$TEMP_BACKUP_PATH"; }' EXIT

  TEMP_BACKUP_PATH="$(mktemp)"

  echo "Creating database dump"
  PGPASSWORD=strapi pg_dump -h postgres -U strapi -d strapi | \
    gzip > "$TEMP_BACKUP_PATH"

  echo "Copying database dump to $S3_BACKUP_DB_PATH"
  rclone copyto --s3-acl="private" "$TEMP_BACKUP_PATH" "$S3_BACKUP_DB_PATH"

  echo "Copying database dump to $S3_BACKUP_LATEST_DB_PATH"
  rclone copyto --s3-acl="private" "$TEMP_BACKUP_PATH" "$S3_BACKUP_LATEST_DB_PATH"

  rm -f "$TEMP_BACKUP_PATH"

  echo "Copying $S3_UPLOADS_DIR to $S3_BACKUP_UPLOADS_DIR"
  rclone copy $RCLONE_OPTIONS --s3-acl="public-read" \
    "$S3_UPLOADS_DIR/" "$S3_BACKUP_UPLOADS_DIR/"

  echo "Backup complete!"

) 2>&1 | ts "[%Y-%m-%d %H:%M:%S]" | tee -a "$LOG_PATH"

ls -rt1 "$LOG_DIR/"*.log | head -n -10 | xargs --no-run-if-empty rm
