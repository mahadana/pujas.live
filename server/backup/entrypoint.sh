#/bin/bash

set -eu

S3_ENDPOINT=us-east-1.linodeobjects.com
S3_BUCKET=pujas-live
# S3_ACCESS_KEY_ID is provided by environment
# S3_SECRET_ACCESS_KEY is provided by environment

BACKUP_USER="runner"
RCLONE_CONFIG_PATH="/home/$BACKUP_USER/.config/rclone/rclone.conf"
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

touch "$CRON_LOG"
chown -R "$BACKUP_USER:$BACKUP_USER" \
  "/home/$BACKUP_USER" "$CRON_LOG"

cat > /etc/cron.d/backup << EOF
# 3am PST
0 11 * * * $BACKUP_USER /backup.sh >> $CRON_LOG 2>&1

EOF

echo "Starting cron..."
cron && tail -f "$CRON_LOG"
