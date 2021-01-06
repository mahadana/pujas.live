#!/bin/bash

[ "${FLOCKER}" != "$0" ] && exec env FLOCKER="$0" flock -en "$0" "$0" "$@" || :

set -eu

log="/var/log/pujas.live-deploy.log"

(
  echo "$(date) start $0"

  cd /opt/pujas.live
  git pull

  function docker-compose-production {
    docker-compose -f server/docker-compose.production.yml "$@"
  }

  docker-compose-production build
  docker-compose-production stop -t 3 worker
  docker-compose-production rm -fs worker
  docker-compose-production stop -t 0 backend frontend
  docker-compose-production rm -fs backend frontend
  docker-compose-production up -d db backend frontend
  docker-compose-production up -d

  docker image prune -f

  echo "$(date) end $0"

) 2>&1 | tee -a "$log"
