# `pujas.live` Server Docs

## Overview

As of January 2021, [Pujas.live](https://pujas.live/) consists of the following
components:

- The main site runs on a 2GB instance at [Linode](https://www.linode.com/).
- DNS is handled by [Namecheap](https://www.namecheap.com/).
- Email delivery is handled by [Mailjet](https://www.mailjet.com/).
- Captchas is handled by [hCaptcha](https://www.hcaptcha.com/).
- YouTube data is via the [YouTube API v3](https://console.cloud.google.com/).
- [Analytics](https://plausible.pujas.live/) (by
  [Plausible](https://plausible.io/)) shares the same Linode instance as the main site.
- The GeoIP database for analytics is from
  [MaxMind](https://www.maxmind.com/en/home).

## Logs

Logs for deploys and worker tasks can be found at https://pujas.live/logs/.

## Common Tasks

On `pujas.live` as `root`:

```sh
# Re-run deployment
/opt/pujas.live/server/deploy.sh

# Show status of docker processes
cd /opt/pujas.live/server
docker-compose ps

# Follow docker logs
cd /opt/pujas.live/server
docker-compose logs -f --tail=20

# Show status of analytics docker processes
cd /opt/plausible
docker-compose ps
```

## Server Setup

1.  Create a 2GB Debian instance on [Linode](https://www.linode.com/) labeled
    `pujas.live`. Note the IP Address.

2.  Assign DNS for `pujas.live`, `api.pujas.live`, `plausible.pujas.live` and
    `www.pujas.live` to the above IP address on
    [Namecheap](https://www.namecheap.com/).

3.  Login to `pujas.live` as `root`, then:

    ```sh
    apt-get update
    apt-get upgrade -y
    echo "pujas.live" > /etc/hostname
    hostname -F /etc/hostname
    perl -pi -e "s/^#?PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config
    systemctl restart ssh.service
    echo "[sshd]" > /etc/fail2ban/jail.local
    echo "enabled = true" >> /etc/fail2ban/jail.local
    echo "banaction = iptables-multiport" >> /etc/fail2ban/jail.local
    systemctl restart fail2ban.service
    ```

4.  Begin the install:

    ```sh
    wget -qO - https://raw.githubusercontent.com/mahadana/pujas.live/main/server/setup.sh | bash
    ```

5.  When prompted, create and edit `/opt/pujas.live/.env` and
    `/opt/plausible/.env`. See LastPass as needed.

    You can create `ADMIN_JWT_SECRET`, `JWT_SECRET` and `SECRET_KEY_BASE` and
    with:

    ```sh
    openssl rand -hex 32
    ```

    `ADMIN_PASSWORD` should be set to the Strapi administrative password for the
    `admin@pujas.live` account.

6.  After editing the `.env` files, continue the setup:

    ```sh
    /opt/pujas.live/server/setup.sh
    ```

7.  Add GitHub webhooks with the following payload URLs:

    [pujas.live](https://github.com/mahadana/pujas.live/settings/hooks):
    `https://pujas.live/hooks/pujas.live-github-deploy`

    [chanting](https://github.com/mahadana/chanting/settings/hooks):
    `https://pujas.live/hooks/chanting-github-deploy`

    [plausible](https://github.com/mahadana/pujas.live/settings/hooks):
    `https://pujas.live/hooks/plausible-github-deploy`

    The secret for each can be found in `/etc/webhook.secret`.
