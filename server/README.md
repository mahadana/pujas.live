# `pujas.live` Server Docs

## Overview

As of February 2021, [Pujas.live] consists of the following components:

- The site runs via [Docker] containers hosted on a 2GB "droplet" at [Digital
  Ocean].
- Image and backup storage is handled by [Digital Ocean] via the S3-compatible
  [Digital Ocean Spaces].
- DNS is handled by [Namecheap].
- Email delivery is handled by [Mailjet].
- Captchas is handled by [hCaptcha].
- YouTube data is via the [YouTube API v3][Google Cloud Platform].
- [Pujas.live Analytics] (by [Plausible]) lives on the same [Digital Ocean]
  droplet as [Pujas.live].
- The GeoIP database for analytics is from
  [MaxMind].

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

## Server Setup Notes

1.  Create a 2GB Debian 10 [Digital Ocean] droplet labeled `do.pujas.live`. Note
    the IPv4 and IPv6 addresses.

2.  Create the following DNS records at [Namecheap](https://www.namecheap.com/):

    | Type  |                      Host |           Value |
    |:-----:|--------------------------:|:---------------:|
    | A     |              `pujas.live` |     (see above) |
    | AAAA  |              `pujas.live` |     (see above) |
    | A     |           `do.pujas.live` |     (see above) |
    | AAAA  |           `do.pujas.live` |     (see above) |
    | CNAME |       `api.do.pujas.live` | `do.pujas.live` |
    | CNAME |       `www.do.pujas.live` | `do.pujas.live` |
    | CNAME | `plausible.do.pujas.live` | `do.pujas.live` |

3.  Login to the new server `do.pujas.live` as `root` and do some prep-work:

    ```sh
    apt-get update
    apt-get upgrade -y
    perl -pi -e "s/^#?PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config
    systemctl restart ssh.service
    echo "do" > /etc/hostname
    hostname -F /etc/hostname
    perl -pi -e "s/^127.0.1.1 .+$/127.0.1.1 do.pujas.live pujas.live do/" /etc/hosts
    ```

4.  [Digital Ocean] droplets do not come pre-configured with swap. Add one
    manually:

    ```sh
    if ! swapon --show | grep -q /swapfile; then
      test -f /swapfile || fallocate -l 2G /swapfile
      chmod 600 /swapfile
      mkswap /swapfile
      swapon /swapfile
    fi

    if ! grep -q /swapfile /etc/fstab; then
      echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi

    echo "vm.swappiness = 1" > /etc/sysctl.d/local.conf
    echo "vm.vfs_cache_pressure = 50" >> /etc/sysctl.d/local.conf
    sysctl --system
    ```

5.  Begin the install of [Pujas.live]:

    ```sh
    wget -qO - https://raw.githubusercontent.com/mahadana/pujas.live/main/server/setup.sh | bash
    ```

6.  When prompted, create and edit `/opt/pujas.live/.env` and
    `/opt/plausible/.env`. See [LastPass] as needed.

    You can create `ADMIN_JWT_SECRET`, `JWT_SECRET` and `SECRET_KEY_BASE` and
    with:

    ```sh
    openssl rand -hex 32
    ```

    `ADMIN_PASSWORD` should be set to the Strapi administrative password for the
    `admin@pujas.live` account.

7.  After editing the `.env` files, continue the setup:

    ```sh
    /opt/pujas.live/server/setup.sh
    ```

8.  Create a [Digital Ocean Spaces] with the following settings:

    - Name: `pujas-live`
    - Colocation: `sfo3`
    - File Listing: Restricted
    - CDN: Enabled
    - CORS Configuration:
      - Origin: `https://*.pujas.live`
      - Allowed Methods: `GET`
      - Allowed Headers: _None_
      - Access Control Max Age: `0`

9.  Setup a [Digital Ocean Firewall] with the following settings:

    - Name: `pujas.live`
    - Inbound Rules: Allow SSH `22`, HTTP `80`, HTTPS `443`
    - Outbound Rules: _Defaults_
    - Droplets: `do.pujas.live`

10. Add [GitHub] webhooks with the following repositories:

    - [pujas.live](https://github.com/mahadana/pujas.live/settings/hooks):
      `https://pujas.live/hooks/pujas.live-github-deploy`

    - [chanting](https://github.com/mahadana/chanting/settings/hooks):
      `https://pujas.live/hooks/chanting-github-deploy`

    - [plausible](https://github.com/mahadana/pujas.live/settings/hooks):
      `https://pujas.live/hooks/plausible-github-deploy`

    The secret for each can be found in `/etc/webhook.secret` on `do.pujas.live`.


[Digital Ocean]: https://cloud.digitalocean.com/
[Digital Ocean Spaces]: https://cloud.digitalocean.com/spaces
[Digital Ocean Firewall]: https://cloud.digitalocean.com/networking/firewalls
[Docker]: https://www.docker.com/
[GitHub]: https://github.com/mahadana/pujas.live
[hCaptcha]: https://www.hcaptcha.com/
[LastPass]: https://www.lastpass.com/
[Mailjet]: https://www.mailjet.com/
[MaxMind]: https://www.maxmind.com/en/home
[Namecheap]: https://www.namecheap.com/
[Plausible]: https://plausible.io/
[Pujas.live]: https://pujas.live/
[Pujas.live Analytics]: https://plausible.pujas.live/
[Google Cloud Platform]: https://console.cloud.google.com/
