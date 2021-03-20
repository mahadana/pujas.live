#!/bin/bash

set -eu

PROJECT="pujas.live"
GIT_URL="https://github.com/mahadana/$PROJECT.git"
BASE_DIR="/opt/$PROJECT"

WEBHOOK_CONF="/etc/webhook.conf"
WEBHOOK_SECRET="/etc/webhook.secret"

test -x /usr/bin/gpg || apt-get install -y gpg

wget -qO- https://download.docker.com/linux/debian/gpg | \
  gpg --dearmor >/etc/apt/trusted.gpg.d/docker.gpg

echo "deb [arch=amd64] https://download.docker.com/linux/debian buster stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y \
  build-essential \
  curl \
  containerd.io \
  docker-ce \
  docker-ce-cli \
  moreutils \
  webhook

DOCKER_COMPOSE_VERSION="$( \
  curl -s https://api.github.com/repos/docker/compose/releases/latest \
    | grep tag_name | cut -d '"' -f 4)"

curl -sL "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
chmod a+x /usr/local/bin/docker-compose

test -d "$BASE_DIR" || git clone "$GIT_URL" "$BASE_DIR"

if ! test -f "$BASE_DIR/.env"; then
  echo "Missing: $env"
  exit 1
fi

chmod 600 "$BASE_DIR/.env"

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

mkdir -p "$BASE_DIR/logs/worker"
chown 1000:1000 "$BASE_DIR/logs/worker"

"$BASE_DIR/server/deploy.sh"

echo "GitHub webhook secret: $(cat "$WEBHOOK_SECRET")"
