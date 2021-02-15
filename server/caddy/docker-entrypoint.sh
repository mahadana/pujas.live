#!/bin/sh

set -eu

sh /etc/caddy/Caddyfile.sh > /etc/caddy/Caddyfile

exec "$@"
