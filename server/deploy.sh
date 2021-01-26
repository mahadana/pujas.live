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
  docker pull node:14 # Specified in Dockerfiles
  docker-compose build
  docker-compose up -d -t 1 postgres redis
  docker-compose up -d -t 1 frontend
  docker-compose up -d -t 1 backend
  docker-compose up -d -t 3 backup worker

  docker image prune -f

  echo "$(date) end $0"

) 2>&1 | tee -a "$log"
