#!/bin/bash

set -eu

PROJECT="neo.pujas.live"
GIT_URL="https://github.com/mahadana/neo.pujas.live.git"
DOMAIN="neo.pujas.live"
EMAIL="admin@pujas.live"
BASE_DIR="/opt/$PROJECT"

if [[ "$(id -u)" != "0" ]]; then
  echo 'Must be run as root'
  exit 1
fi

function rand {
  head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8
}

test -x /usr/sbin/nginx || apt-get install -y nginx-light
test -x /usr/bin/certbot || apt-get install -y certbot
test -d /usr/share/doc/python3-certbot-nginx || apt-get install -y python3-certbot-nginx
test -x /usr/bin/webhook || apt-get install -y webhook

test -d "$BASE_DIR" || git clone "$GIT_URL" "$BASE_DIR"

cd "$BASE_DIR"

cp server/nginx.conf "/etc/nginx/sites-available/$PROJECT"
ln -sf "../sites-available/$PROJECT" "/etc/nginx/sites-enabled/$PROJECT"

certbot --nginx --non-interactive --agree-tos --email "$EMAIL" \
  --domain "$DOMAIN" --domain "api.$DOMAIN" --domain "www.$DOMAIN"

systemctl restart nginx.service

if ! test -f /etc/webhook.conf.secret; then
  touch /etc/webhook.conf.secret
  chmod 600 /etc/webhook.conf.secret
  rand > /etc/webhook.conf.secret
fi

touch "/etc/webhook.conf.$PROJECT"
chmod 600 "/etc/webhook.conf.$PROJECT"
cp server/webhook.conf "/etc/webhook.conf.$PROJECT"
perl -pi -e "s/SECRET/$(cat /etc/webhook.conf.secret)/" "/etc/webhook.conf.$PROJECT"

echo "Add the contents of /etc/webhook.conf.$PROJECT to /etc/webhook.conf"
echo "GitHub Webhook URL: https://$DOMAIN/hooks/$PROJECT-github-deploy"
echo "GitHub Webhook Secret: $(cat /etc/webhook.conf.secret)"

"$BASE_DIR/server/deploy.sh"
