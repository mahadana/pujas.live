#!/bin/bash

set -eu

if [ $# = 0 ]; then
  echo "Usage: $0 <service>"
  exit 1
fi

SERVICE="$1"

case "$SERVICE" in
  backend)
    VOLUME_DIRS=".cache build"
    ;;
  frontend)
    VOLUME_DIRS=".next"
    ;;
  worker)
    VOLUME_DIRS=""
    ;;
  *)
    echo "Invalid service: $SERVICE"
    exit 1
esac

cd "/app/$SERVICE"

uid=$(stat -c %u .)
gid=$(stat -c %g .)

if [ $uid = 0 ]; then
  # Host is Mac/Windows, run as root...
  user=root
else
  user=node
  userdel node 2> /dev/null || true
  groupdel node 2> /dev/null || true
  groupadd -g $gid node
  useradd -u $uid -g $gid -d /home/node -s /bin/bash node
  chown -R node:node /home/node
  chown node:node node_modules $VOLUME_DIRS
fi

if [ $(ls node_modules | wc -l) = 0 ]; then
  echo "Installing node modules..."
  su -c "npm install --silent" $user
fi

if [ "$SERVICE" = backend ]; then
  if [ $(ls build | wc -l) = 0 ]; then
    su -c "npm run build" $user
  fi
  su -c "node scripts/seed.js" $user
fi

su -c "npm run dev" $user
