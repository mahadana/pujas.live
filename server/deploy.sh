#!/bin/bash

[ "${FLOCKER}" != "$0" ] && exec env FLOCKER="$0" flock -en "$0" "$0" "$@" || :

set -eu
SCRIPT_PATH="$(realpath "$0")"
cd "$(dirname "$0")/.."

LOG_NAME="deploy"
LOG_DIR="$(pwd)/logs/deploy"
LOG_FILE="$LOG_NAME-$(date +%Y-%m-%d).log"
LOG_PATH="$LOG_DIR/$LOG_FILE"
LATEST_PATH="$LOG_DIR/latest-$LOG_NAME.log"

mkdir -p "$LOG_DIR"
ln -sf "$LOG_FILE" "$LATEST_PATH"

(
  echo "$SCRIPT_PATH START"

  git fetch
  git reset --hard origin/main

  cd server

  docker-compose pull -q
  docker pull -q node:14 # Specified in Dockerfiles
  docker-compose build
  docker-compose up -d -t 1 postgres
  docker-compose up -d -t 1 backend frontend
  docker-compose up -d -t 3 # everything else
  docker image prune -f

  git log -1

  echo "$SCRIPT_PATH END"

) 2>&1 | ts "[%Y-%m-%d %H:%M:%S]" | tee -a "$LOG_PATH"

ls -rt1 "$LOG_DIR/$LOG_NAME-"*.log | head -n -10 | xargs --no-run-if-empty rm
