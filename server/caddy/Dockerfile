FROM caddy:2.3.0

COPY Caddyfile.sh /etc/caddy/Caddyfile.sh
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod 0755 /etc/caddy/Caddyfile.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
