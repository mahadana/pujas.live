# `pujas.live`

## Server Setup

1.  On the server as `root`:

    ```sh
    wget -qO- 'https://raw.githubusercontent.com/mahadana/pujas.live/main/server/setup.sh' | bash
    ```

2.  The above script wil exit to have you create and edit `.env`.
    You will need the various keys from [Mailjet](https://www.mailjet.com/),
    [hCaptcha](https://www.hcaptcha.com/), and
    [Google APIs](https://console.cloud.google.com/). `ADMIN_PASSWORD` is the
    password to auto-assign to `admin@pujas.live` for use with the site.
    You can create `ADMIN_JWT_SECRET` and `JWT_SECRET` with:

    ```sh
    openssl rand -hex 32
    ```

3.  Continue the setup:

    ```sh
    bash /opt/pujas.live/server/setup.sh
    ```

## Reset

To completely reset from scratch:

```sh
cd /opt/pujas.live
docker-compose down
docker volume rm $(docker volume ls -q | grep pujaslive)
docker-compose -f docker-compose.production.yml up -d
```
