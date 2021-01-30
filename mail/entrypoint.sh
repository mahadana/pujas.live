#!/bin/bash

set -eu

if [ $# -gt 0 ]; then
  exec "$@"
  exit 0
fi

if test -z "${MAIL_RELAY_HOST+x}"; then
  echo "Routing mail locally to root (MAIL_RELAY_* not set in .env)"
  perl -pi -e "s/^(virtual_alias_domain =).*$/\\1 */" /etc/postfix/main.cf
  perl -pi -e "s/^(relayhost =).*$/\\1/" /etc/postfix/main.cf
  echo "/^/ root@localhost" > /etc/postfix/virtual_alias
  echo "" > /etc/postfix/sasl_password
else
  echo "Relaying mail to $MAIL_RELAY_HOST"
  perl -pi -e "s/^(virtual_alias_domain =).*$/\\1/" /etc/postfix/main.cf
  perl -pi -e "s/^(relayhost =).*$/\\1 [$MAIL_RELAY_HOST]:$MAIL_RELAY_PORT/" /etc/postfix/main.cf
  echo "" > /etc/postfix/virtual_alias
  echo "$MAIL_RELAY_HOST $MAIL_RELAY_USER:$MAIL_RELAY_PASSWORD" > /etc/postfix/sasl_password
fi

postmap /etc/postfix/virtual_alias
chmod 600 /etc/postfix/sasl_password
postmap /etc/postfix/sasl_password

cp /etc/resolv.conf /var/spool/postfix/etc/resolv.conf
rm -f /run/rsyslogd.pid
ln -sf /proc/$$/fd/1 /var/log/all.log

postfix start
rsyslogd -n
