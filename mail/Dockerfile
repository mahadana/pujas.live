FROM debian:latest

RUN echo "postfix postfix/main_mailer_type string 'Internet Site'" \
      | debconf-set-selections && \
    echo "postfix postfix/mailname string mail" \
      | debconf-set-selections

RUN apt-get update -qq && \
    apt-get install -yqq \
      bsd-mailx \
      libsasl2-modules \
      postfix \
      rsyslog \
    > /dev/null 2>&1 \
    && rm -rf /var/lib/apt/lists/*

COPY main.cf /etc/postfix/main.cf
COPY rsyslog.conf /etc/rsyslog.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod 0755 /entrypoint.sh

EXPOSE 25
ENTRYPOINT ["/entrypoint.sh"]
