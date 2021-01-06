# `pujas.live`

## Server Setup

1.  On the server as `root`:

    ```sh
    wget -qO- 'https://raw.githubusercontent.com/mahadana/pujas.live/main/server/setup.sh' | bash
    ```

2.  The above script wil exit to have you edit the following `.env` files:

    `backend/.env`:

    ```
    ADMIN_JWT_SECRET=...
    ADMIN_PASSWORD=...
    HCAPTCHA_SECRET=...
    JWT_SECRET=...
    MAILJET_PUBLIC_KEY=...
    MAILJET_SECRET_KEY=...
    ```

    `frontend/.env`:

    ```
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY=...
    ```

    `worker/.env`:

    ```
    YOUTUBE_API_KEY=...
    ```

    You will need the various keys from [Mailjet](https://www.mailjet.com/),
    [hCaptcha](https://www.hcaptcha.com/), and
    [Google APIs](https://console.cloud.google.com/).
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
