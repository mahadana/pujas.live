# `neo.pujas.live`

## Quick Start

Install [Docker](https://docs.docker.com/get-docker/) and
[docker-compose](https://docs.docker.com/compose/install/). Then:

```sh
git clone https://github.com/mahadana/neo.pujas.live.git
cd neo.pujas.live
docker-compose up
```

Browse to http://localhost:3000/ for the application.  
Browse to http://localhost:1337/admin/ for the admin.

The default credentials (for both):

- Email: `admin@pujas.live`
- Password: `Password1`

## Email

If you wish to test the email functionality, create an account with
[Mailtrap](https://mailtrap.io/) and add the secrets to `backend/.env`:

```
MAILTRAP_USER=...
MAILTRAP_PASSWORD=...
```

## Useful Commands

```sh
# Restart from scratch
docker-compose down && docker-compose up

# Spawn a shell on the frontend
./shell frontend # or backend, db, frontend, redis, worker

# Install an npm module on the frontend
./shell frontend npm install --save <module>

# Spawn a strapi console
./shell backend npx -c 'PORT=1338 strapi console'
```

## Server Setup

```sh
wget -qO- 'https://raw.githubusercontent.com/mahadana/neo.pujas.live/main/server/setup.sh' | bash
```

Edit `backend/.env`:

```
ADMIN_JWT_SECRET=...
JWT_SECRET=...
MAILJET_PUBLIC_KEY=...
MAILJET_SECRET_KEY=...
STRAPI_ADMIN_PASSWORD=...
```

You can create JWT secrets with:

```sh
openssl rand -hex 32
```
