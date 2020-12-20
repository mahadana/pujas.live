#!/bin/bash

set -eu

uid=$(stat -c %u .)
gid=$(stat -c %g .)

if [ $uid = 0 ]; then
  user=root
else
  if getent passwd node 2>&1 >/dev/null; then
    userdel node
  fi
  if getent group node 2>&1 >/dev/null; then
    groupdel node
  fi
  groupadd -g $gid node
  useradd -u $uid -g $gid -d /home/node -s /bin/bash node
  chown -R node:node /home/node
  user=node
fi

if ! test -d node_modules; then
  echo "Installing node modules..."
  su -c "npm install --silent" $user
fi

su -c "npm run dev" $user
