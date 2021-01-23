#!/bin/bash

[ "${FLOCKER}" != "$0" ] && exec env FLOCKER="$0" flock -en "$0" "$0" "$@" || :

set -eu

log="/var/log/pujas.live-deploy.log"

(
  echo "$(date) start $0"

  cd /opt/pujas.live
  git pull

  cd server

  docker-compose pull
  docker-compose build
  docker-compose stop -t 3 worker
  docker-compose rm -fs worker
  docker-compose stop -t 0 backend frontend
  docker-compose rm -fs backend frontend
  docker-compose up -d postgres backend frontend
  docker-compose up -d

  docker image prune -f

  echo "$(date) end $0"

) 2>&1 | tee -a "$log"
