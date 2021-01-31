#!/bin/bash

set -eu

PROJECT="pujas.live"
GIT_URL="https://github.com/mahadana/$PROJECT.git"
BASE_DIR="/opt/$PROJECT"

CHANTING_PROJECT="chanting"
CHANTING_GIT_URL="https://github.com/mahadana/$CHANTING_PROJECT.git"
CHANTING_BASE_DIR="/opt/$CHANTING_PROJECT"

PLAUSIBLE_PROJECT="plausible"
PLAUSIBLE_GIT_URL="https://github.com/mahadana/$PLAUSIBLE_PROJECT.git"
PLAUSIBLE_BASE_DIR="/opt/$PLAUSIBLE_PROJECT"

WEBHOOK_CONF="/etc/webhook.conf"
WEBHOOK_SECRET="/etc/webhook.secret"

test -d "$BASE_DIR" || git clone "$GIT_URL" "$BASE_DIR"

test -d "$CHANTING_BASE_DIR" || \
  git clone "$CHANTING_GIT_URL" "$CHANTING_BASE_DIR"

test -d "$PLAUSIBLE_BASE_DIR" || \
  git clone "$PLAUSIBLE_GIT_URL" "$PLAUSIBLE_BASE_DIR"

missing=

for env in "$BASE_DIR/.env" "$PLAUSIBLE_BASE_DIR/.env"; do
  if ! test -f "$env"; then
    echo "Missing: $env"
    missing=1
  fi
done

if test -n missing; then
  exit 1
fi

chmod 600 "$BASE_DIR/.env"
chmod 600 "$PLAUSIBLE_BASE_DIR/.env"

test -x /usr/bin/webhook || apt-get install -y webhook

if ! test -f "$WEBHOOK_SECRET"; then
  touch "$WEBHOOK_SECRET"
  chmod 600 "$WEBHOOK_SECRET"
  head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8 \
    > "$WEBHOOK_SECRET"
fi

cp "$BASE_DIR/server/webhook.conf" "$WEBHOOK_CONF"
chmod 600 "$WEBHOOK_CONF"
perl -pi -e "s/SECRET/$(cat "$WEBHOOK_SECRET")/" "$WEBHOOK_CONF"

systemctl restart webhook.service

"$BASE_DIR/server/deploy.sh"

"$PLAUSIBLE_BASE_DIR/server/deploy.sh"
