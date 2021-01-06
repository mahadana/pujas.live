# `pujas.live`

## Quick Start

Install [Docker](https://docs.docker.com/get-docker/) and
[docker-compose](https://docs.docker.com/compose/install/). Then:

```sh
git clone https://github.com/mahadana/pujas.live.git
cd pujas.live
docker-compose up
```

Then browse:

- Frontend: http://localhost:3000/
- Backend: http://localhost:1337/admin/

The default credentials (for both):

- Email: `admin@pujas.live`
- Password: `Password1`

## Task Helper

```sh
# Run a bash shell in the frontend container
./task frontend

# Show help and additional examples
./task -h
```

## Email and Captchas

To enable email and captchas on local development requires a few more steps:

1.  Create an account with [Mailtrap](https://mailtrap.io/).

2.  Create an account with [hCaptcha](https://www.hcaptcha.com/).

3.  Edit `/etc/hosts` (or the equivalent):

    ```
    127.0.0.1 pujas.test
    ```

4.  Edit `backend/.env`:

    ```
    FRONTEND_URL=http://pujas.test:3000
    HCAPTCHA_SECRET=...
    MAILTRAP_USER=...
    MAILTRAP_PASSWORD=...
    ```

5.  Edit `frontend/.env`:

    ```
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY=...
    ```

6.  Finally, use the following URLs when browsing:

    - Frontend: http://pujas.test:3000/
    - Backend: http://pujas.test:1337/admin/

## Server Setup

See the [server documentation](server/README.md).
