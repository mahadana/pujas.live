#!/bin/bash

[ "${FLOCKER}" != "$0" ] && exec env FLOCKER="$0" flock -en "$0" "$0" "$@" || :

set -eu

cd /opt/pujas.live
git fetch
git reset --hard origin/main

nohup server/deploy.sh > /dev/null 2>&1 &
