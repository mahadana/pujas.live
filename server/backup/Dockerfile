FROM postgres:latest

RUN apt-get update -qq && \
    apt-get -y install -qq \
      curl \
      cron \
      unzip \
    && rm -rf /var/lib/apt/lists/*
RUN curl https://rclone.org/install.sh | bash

COPY backup.sh /backup.sh
COPY entrypoint.sh /entrypoint.sh

RUN chmod 0755 /backup.sh /entrypoint.sh

ENTRYPOINT /entrypoint.sh
