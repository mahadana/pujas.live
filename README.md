# `neo.pujas.live`

## Quick Start

Install [Docker](https://docs.docker.com/get-docker/) and
[docker-compose](https://docs.docker.com/compose/install/). Then:

```sh
git clone https://github.com/mahadana/neo.pujas.live.git
cd neo.pujas.live
docker-compose up
```

Then browse:

- Frontend: http://localhost:3000/
- Backend: http://localhost:1337/admin/

The default credentials (for both):

- Email: `admin@pujas.live`
- Password: `Password1`

## Local Development

Working with email and captchas requires a few more steps:

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

## Shell Helper

```sh
# Run a bash shell on the frontend
./shell frontend

# Show help and additional examples
./shell -h
```

## Server Setup

```sh
wget -qO- 'https://raw.githubusercontent.com/mahadana/neo.pujas.live/main/server/setup.sh' | bash
```

Edit `backend/.env`:

```
ADMIN_JWT_SECRET=...
ADMIN_PASSWORD=...
HCAPTCHA_SECRET=...
JWT_SECRET=...
MAILJET_PUBLIC_KEY=...
MAILJET_SECRET_KEY=...
```

Edit `frontend/.env`:

```
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=...
```

You can create JWT secrets with:

```sh
openssl rand -hex 32
```

To completely restart from on scratch:

```sh
cd /opt/neo.pujas.live
docker-compose down
docker volume rm $(docker volume ls -q | grep neopujaslive)
docker-compose -f docker-compose.production.yml up -d
```
