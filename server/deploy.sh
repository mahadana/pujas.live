#!/bin/bash

[ "${FLOCKER}" != "$0" ] && exec env FLOCKER="$0" flock -en "$0" "$0" "$@" || :

set -eu
cd "$(dirname "$0")/.."

LOG_DIR="$(pwd)/logs/deploy/$(date +%Y/%m)"
LOG_FILE="pujas.live-deploy-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"

(
  echo "$(date) start $0"

  git fetch
  git reset --hard origin/main

  cd server

  docker-compose pull
  docker pull node:14 # Specified in Dockerfiles
  docker-compose build
  docker-compose up -d -t 1 postgres
  docker-compose up -d -t 1 backend frontend
  docker-compose up -d -t 3 # everything else

  docker image prune -f

  echo "$(date) end $0"

) 2>&1 | tee -a "$LOG_DIR/$LOG_FILE"
