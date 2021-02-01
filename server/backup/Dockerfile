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
COPY entrypoint.sh /entrypoint.sh

RUN chmod 0755 /backup.sh /entrypoint.sh

ENTRYPOINT /entrypoint.sh
