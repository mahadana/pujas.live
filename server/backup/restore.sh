#!/bin/bash

set -Eeuo pipefail

if [ "$(id -nu)" != "backy" ]; then
  exec su -c "bash $0 $*" backy
  exit 0
fi

RCLONE_OPTIONS="--verbose --tpslimit 20 --fast-list"
S3_BUCKET="$(cat "$HOME/s3-bucket")"
S3_BACKUP_DIR="s3:$S3_BUCKET/backups"
S3_UPLOADS_DIR="s3:$S3_BUCKET/uploads"

function usage {
  cat <<EOF
Usage: $0 COMMAND [...]

Commands:

  list                         list backup database files and backup uploads
  site-postgres REMOTE         restore site postgres database from REMOTE
  plausible-postgres REMOTE    restore plausible postgres database from REMOTE
  plausible-clickhouse REMOTE  restore plausible clickhouse database from REMOTE
  uploads REMOTE               restore uploads from REMOTE
EOF
}

function list-databases {
  local TYPE="$1"
  local INCLUDE="$2"
  echo "Backup $TYPE databases:"
  echo
  rclone lsf --max-depth 3 --include "$INCLUDE" "$S3_BACKUP_DIR" | \
    grep -v '/$' | sed "s@^@  $S3_BACKUP_DIR/@g"
}

function list-uploads {
  echo "Backup uploads:"
  echo
  rclone lsf --max-depth 3 --include "" "$S3_BACKUP_DIR" | \
    grep '/uploads/' | sed 's@/$@@g' | sed "s@^@  $S3_BACKUP_DIR/@g"
}

function restore-postgres {
  local TYPE="$1"
  local REMOTE_PATH="$2"
  local DB_HOST="$3"
  local DB_USER="$4"
  local DB_PASSWORD="$5"
  local DB_NAME="$6"
  TEMP_BACKUP_PATH="$(mktemp)"
  trap '{ rm -f "$TEMP_BACKUP_PATH"; }' EXIT

  echo "Downloading $TYPE database from $REMOTE_PATH"
  rclone copyto "$REMOTE_PATH" "$TEMP_BACKUP_PATH"

  echo "Removing $TYPE database"
  echo "DROP DATABASE IF EXISTS $DB_NAME" | \
    PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 \
      -h "$DB_HOST" -U "$DB_USER" -d postgres > /dev/null

  echo "Creating $TYPE database"
  echo "CREATE DATABASE $DB_NAME" | \
    PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 \
      -h "$DB_HOST" -U "$DB_USER" -d postgres > /dev/null

  echo "Restoring $TYPE database"
  cat "$TEMP_BACKUP_PATH" | gzip -d | \
    PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 \
      -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" > /dev/null

  rm -f "$TEMP_BACKUP_PATH"
  trap - EXIT
}

function restore-clickhouse {
  local TYPE="$1"
  local REMOTE_PATH="$2"
  local DB_HOST="$3"
  local DB_NAME="$4"
  TEMP_BACKUP_PATH="$(mktemp)"
  trap '{ rm -f "$TEMP_BACKUP_PATH"; }' EXIT

  echo "Downloading $TYPE database from $REMOTE_PATH"
  rclone copyto "$REMOTE_PATH" "$TEMP_BACKUP_PATH"

  cat "$TEMP_BACKUP_PATH" | gzip -d | \
    clickhouse-backup.sh -v -h "$DB_HOST" -d "$DB_NAME" restore

  rm -f "$TEMP_BACKUP_PATH"
  trap - EXIT
}

function restore-uploads {
  local REMOTE_DIR="$1"

  echo "Copying $REMOTE_DIR to $S3_UPLOADS_DIR"
  rclone copy $RCLONE_OPTIONS --s3-acl="public-read" \
    "$REMOTE_DIR/" "$S3_UPLOADS_DIR/"
}

if [ $# = 0 ]; then
  usage
  exit 1
fi

COMMAND="$1"

if [ "$COMMAND" = list ]; then

  list-databases "site postgres" "site-postgres-*.gz"
  echo
  list-databases "plausible postgres" "plausible-postgres-*.gz"
  echo
  list-databases "plausible clickhouse" "plausible-clickhouse-*.gz"
  echo
  list-uploads

elif [ "$COMMAND" = site-postgres ]; then

  restore-postgres "site postgres" "$2" \
    postgres strapi strapi strapi

elif [ "$COMMAND" = plausible-postgres ]; then

  restore-postgres "plausible postgres" "$2" \
    plausible_postgres plausible plausible plausible

elif [ "$COMMAND" = plausible-clickhouse ]; then

  restore-clickhouse "plausible clickhouse" "$2" \
    plausible_clickhouse plausible

elif [ "$COMMAND" = uploads ]; then

  restore-uploads "$2"

else

  usage
  exit 1

fi
