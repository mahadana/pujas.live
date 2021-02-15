FROM debian:buster-slim

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -yqq \
      ca-certificates \
      curl \
      gpg \
      lsb-release \
      > /dev/null 2>&1 && \
    rm -rf /var/lib/apt/lists/*

RUN curl -s https://repo.clickhouse.tech/CLICKHOUSE-KEY.GPG | \
      gpg --dearmor > /etc/apt/trusted.gpg.d/clickhouse.gpg && \
    echo "deb https://repo.clickhouse.tech/deb/stable/ main/" \
      > /etc/apt/sources.list.d/clickhouse.list && \
    curl -s https://download.docker.com/linux/debian/gpg | \
      gpg --dearmor > /etc/apt/trusted.gpg.d/docker.gpg && \
    echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
      > /etc/apt/sources.list.d/docker.list && \
    curl -s https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
      gpg --dearmor > /etc/apt/trusted.gpg.d/pgdg.gpg && \
    echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
      > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -yqq \
      clickhouse-client \
      containerd.io \
      cron \
      docker-ce \
      docker-ce-cli \
      moreutils \
      postgresql-client-13 \
      rsyslog \
      unzip \
      > /dev/null 2>&1 && \
    rm -rf /var/lib/apt/lists/*

RUN DCV="$(curl -s https://api.github.com/repos/docker/compose/releases/latest \
      | grep tag_name | cut -d \" -f 4)" && \
    curl -sL "https://github.com/docker/compose/releases/download/$DCV/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose && \
    chmod a+x /usr/local/bin/docker-compose

RUN curl -s https://rclone.org/install.sh | bash > /dev/null 2>&1 && \
    rm -rf /tmp/*

RUN curl -s https://raw.githubusercontent.com/mahadana/clickhouse-backup.sh/main/clickhouse-backup.sh \
      -o /usr/local/bin/clickhouse-backup.sh && \
    chmod a+x /usr/local/bin/clickhouse-backup.sh

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
