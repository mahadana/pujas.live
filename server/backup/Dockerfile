FROM postgres:latest

RUN apt-get update -qq && \
    apt-get install -yqq \
      curl \
      cron \
      unzip \
    > /dev/null 2>&1 \
    && rm -rf /var/lib/apt/lists/*
RUN curl -s https://rclone.org/install.sh | bash > /dev/null 2>&1

COPY backup.sh /backup.sh
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod 0755 /backup.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
