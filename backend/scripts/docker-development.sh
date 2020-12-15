#!/bin/bash

set -eu

if getent passwd node 2>&1 >/dev/null; then
  userdel node
fi

if getent group node 2>&1 >/dev/null; then
  groupdel node
fi

uid=$(stat -c %u .)
gid=$(stat -c %g .)
groupadd -g $gid node
useradd -u $uid -g $gid -d /home/node -s /bin/bash node
chown -R node:node /home/node

if ! test -d node_modules; then
  echo "Installing node modules..."
  su -c "npm install --silent" node
fi

su -c "npm run develop" node
