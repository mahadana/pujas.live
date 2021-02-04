#!/bin/bash

set -Eeuo pipefail

if [ $# != "0" ]; then
  exec "$@"
  exit 0
fi

BACKUP_USER="runner"
RCLONE_CONFIG_PATH="/home/$BACKUP_USER/.config/rclone/rclone.conf"
BUCKET_CONFIG_PATH="/home/$BACKUP_USER/s3-bucket"
CRON_LOG="/home/$BACKUP_USER/backup.log"

if ! getent passwd "$BACKUP_USER" > /dev/null; then
  useradd -m "$BACKUP_USER"
fi

mkdir -p "$(dirname "$RCLONE_CONFIG_PATH")"
touch "$RCLONE_CONFIG_PATH"
chmod 600 "$RCLONE_CONFIG_PATH"

cat > "$RCLONE_CONFIG_PATH" << EOF
[s3]
type = s3
provider = Other
env_auth = false
access_key_id = $S3_ACCESS_KEY_ID
secret_access_key = $S3_SECRET_ACCESS_KEY
endpoint = $S3_ENDPOINT
EOF

echo "$S3_BUCKET" > "$BUCKET_CONFIG_PATH"

touch "$CRON_LOG"
chown -R "$BACKUP_USER:$BACKUP_USER" \
  "/home/$BACKUP_USER" "$CRON_LOG"

cat > /etc/cron.d/backup << EOF
# 3am PST
0 11 * * * $BACKUP_USER /backup.sh >> $CRON_LOG 2>&1

EOF

echo "Starting cron..."
cron && tail -f "$CRON_LOG"
