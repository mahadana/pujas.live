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

## Common Server Tasks

On `pujas.live` as `root`:

```sh
# Follow deployment log
tail -f /var/log/pujas.live-deploy.log

# Re-run deployment
/opt/pujas.live/server/deploy.sh

# Show status of docker processes
cd /opt/pujas.live/server
docker-compose ps

# Follow docker logs
cd /opt/pujas.live/server
docker-compose logs -f --tail=20

# Show status of analytics processes
cd /opt/plausible.pujas.live
docker-compose ps
```

## Server Setup

1.  On `pujas.live` as `root`:

    ```sh
    git clone https://github.com/mahadana/pujas.live.git /opt/pujas.live
    cd pujas.live
    cp .env.example .env
    ```

2.  Edit `.env` using the appopriate credentials. See LastPass.

    You can create `ADMIN_JWT_SECRET` and `JWT_SECRET` with:

    ```sh
    openssl rand -hex 32
    ```

    `ADMIN_PASSWORD` should be set to the Strapi administraive password for the
    `admin@pujas.live` account.

3.  After editing `.env`, continue the setup:

    ```sh
    bash /opt/pujas.live/server/setup.sh
    ```

4.  Add GitHub webhooks with the following payload URLs:

    [pujas.live](https://github.com/mahadana/pujas.live/settings/hooks):
    `https://pujas.live/hooks/pujas.live-github-deploy`

    [chanting](https://github.com/mahadana/chanting/settings/hooks):
    `https://pujas.live/hooks/chanting-github-deploy`

    The secret for each can be found in `/etc/webhook.secret`.
