#!/bin/bash

set -eu

PROJECT="pujas.live"
GIT_URL="https://github.com/mahadana/$PROJECT.git"
BASE_DIR="/opt/$PROJECT"

CHANTING_PROJECT="chanting"
CHANTING_GIT_URL="https://github.com/mahadana/$CHANTING_PROJECT.git"
CHANTING_BASE_DIR="/opt/$CHANTING_PROJECT"

DOMAIN="$PROJECT"
EMAIL="admin@$PROJECT"

if [[ "$(id -u)" != "0" ]]; then
  echo 'Must be run as root'
  exit 1
fi

test -d "$BASE_DIR" || git clone "$GIT_URL" "$BASE_DIR"

if ! test -f "$BASE_DIR/.env"; then
  echo "Missing: $BASE_DIR/.env"
  exit 1
fi

chmod 600 "$BASE_DIR/.env"

test -d "$CHANTING_BASE_DIR" || \
  git clone "$CHANTING_GIT_URL" "$CHANTING_BASE_DIR"

test -x /usr/bin/webhook || apt-get install -y webhook

WEBHOOK_CONF="/etc/webhook.conf"
WEBHOOK_SECRET="/etc/webhook.secret"

if ! test -f "$WEBHOOK_SECRET"; then
  touch "$WEBHOOK_SECRET"
  chmod 600 "$WEBHOOK_SECRET"
  head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8 \
    > "$WEBHOOK_SECRET"
fi

cp "$BASE_DIR/server/webhook.conf" "$WEBHOOK_CONF"
chmod 600 "$WEBHOOK_CONF"
perl -pi -e "s/SECRET/$(cat "$WEBHOOK_SECRET")/" "$WEBHOOK_CONF"

"$BASE_DIR/server/deploy.sh"
