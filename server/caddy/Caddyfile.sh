#!/bin/sh

set -eu

deurl () {
  echo "$1" | sed 's_^https\?://__'
}

FRONTEND_DOMAIN="$(deurl "$FRONTEND_URL")"
BACKEND_DOMAIN="$(deurl "$BACKEND_URL")"
PLAUSIBLE_DOMAIN="$(deurl "$PLAUSIBLE_URL")"

cat <<EOF
$FRONTEND_DOMAIN {
  redir /chanting /chanting/
  handle_path /chanting/* {
    root * /opt/chanting
    file_server
  }
  redir /logs /logs/
  handle_path /logs/* {
    root * /logs
    file_server browse
  }
  reverse_proxy /hooks/* $FRONTEND_DOMAIN:9000
  reverse_proxy frontend:3000
}

www.$FRONTEND_DOMAIN {
  redir $FRONTEND_URL{uri}
}

$BACKEND_DOMAIN {
  reverse_proxy backend:1337
}

$PLAUSIBLE_DOMAIN {
  reverse_proxy plausible:8000
}
EOF
