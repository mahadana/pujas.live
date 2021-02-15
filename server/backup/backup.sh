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
  S3_BACKUP_MONTH_DIR="$S3_BACKUP_DIR/$(date +%Y/%m)"
  DATE_SUFFIX="$(date +%Y-%m-%d)"

  S3_BACKUP_SITE_POSTGRES_PATH="$S3_BACKUP_MONTH_DIR/site-postgres-$DATE_SUFFIX.gz"
  S3_BACKUP_PLAUSIBLE_POSTGRES_PATH="$S3_BACKUP_MONTH_DIR/plausible-postgres-$DATE_SUFFIX.gz"
  S3_BACKUP_PLAUSIBLE_CLICKHOUSE_PATH="$S3_BACKUP_MONTH_DIR/plausible-clickhouse-$DATE_SUFFIX.gz"
  S3_BACKUP_UPLOADS_DIR="$S3_BACKUP_MONTH_DIR/uploads"

  echo "Backup start..."

  TEMP_BACKUP_PATH="$(mktemp)"
  trap '{ set +eu; rm -f "$TEMP_BACKUP_PATH"; }' EXIT

  echo "Creating site postgres dump"
  PGPASSWORD=strapi pg_dump -h postgres -U strapi -d strapi | \
    gzip > "$TEMP_BACKUP_PATH"

  echo "Copying site postgres dump to $S3_BACKUP_SITE_POSTGRES_PATH"
  rclone copyto --s3-acl="private" "$TEMP_BACKUP_PATH" "$S3_BACKUP_SITE_POSTGRES_PATH"

  echo "Creating plausible postgres dump"
  PGPASSWORD=plausible pg_dump -h plausible_postgres -U plausible -d plausible | \
    gzip > "$TEMP_BACKUP_PATH"

  echo "Copying plausible postgres dump to $S3_BACKUP_PLAUSIBLE_POSTGRES_PATH"
    rclone copyto --s3-acl="private" "$TEMP_BACKUP_PATH" "$S3_BACKUP_PLAUSIBLE_POSTGRES_PATH"

  echo "Creating plausible clickhouse dump"
  clickhouse-backup.sh -h plausible_clickhouse -d plausible backup | \
    gzip > "$TEMP_BACKUP_PATH"

  echo "Copying plausible clickhouse dump to $S3_BACKUP_PLAUSIBLE_CLICKHOUSE_PATH"
    rclone copyto --s3-acl="private" "$TEMP_BACKUP_PATH" "$S3_BACKUP_PLAUSIBLE_CLICKHOUSE_PATH"

  rm -f "$TEMP_BACKUP_PATH"

  echo "Copying $S3_UPLOADS_DIR to $S3_BACKUP_UPLOADS_DIR"
  rclone copy $RCLONE_OPTIONS --s3-acl="public-read" \
    "$S3_UPLOADS_DIR/" "$S3_BACKUP_UPLOADS_DIR/"

  echo "Backup complete!"

) 2>&1 | tee >(ts "[%Y-%m-%d %H:%M:%S]" >> "$LOG_PATH")

ls -rt1 "$LOG_DIR/"*.log | head -n -10 | xargs --no-run-if-empty rm
