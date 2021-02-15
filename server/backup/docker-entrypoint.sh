#!/bin/bash

set -Eeuo pipefail

if [ $# != "0" ]; then
  exec "$@"
  exit 0
fi

if ! getent passwd backy > /dev/null; then
  useradd -u 1000 -m backy
fi

echo "$S3_BUCKET" > /home/backy/s3-bucket

RCLONE_CONFIG_PATH="/home/backy/.config/rclone/rclone.conf"
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

chown -R backy:backy /home/backy

mkdir -p /logs/backups
chown backy:backy /logs/backups

cat > /etc/cron.d/backup << EOF
# 3am PST
0 11 * * * backy /backup.sh > /dev/null 2>&1

EOF

rm -f /run/rsyslogd.pid
ln -sf /proc/$$/fd/1 /var/log/all.log

cron
rsyslogd -n
