FROM postgres:latest

RUN apt-get update -qq && \
    apt-get install -yqq \
      curl \
      cron \
      moreutils \
      rsyslog \
      unzip \
    > /dev/null 2>&1 \
    && rm -rf /var/lib/apt/lists/*
RUN curl -s https://rclone.org/install.sh | bash > /dev/null 2>&1

COPY rsyslog.conf /etc/rsyslog.conf
COPY backup.sh \
     docker-entrypoint.sh \
     restore.sh \
     /
RUN chmod 0755 \
      /backup.sh \
      /docker-entrypoint.sh \
      /restore.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
