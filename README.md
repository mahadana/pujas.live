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

```
Usage: ./task <service> [command...]

  Bash shell                        ./task <backend|frontend|worker>
  Strapi console                    ./task backend console
  PostgreSQL console                ./task postgres console
  Redis console                     ./task redis console

  Run all tests                     ./task test
  Run <service> tests               ./task <backend|frontend|worker> test
  Watch <service> tests             ./task <backend|frontend|worker> watch

  Run npm install in node services  ./task install
  Apply auto-formatting (prettier)  ./task pretty
  Run linter (eslint)               ./task lint
  Add fake data                     ./task fake
  (Re)build Strapi admin            ./task build-admin
  Reset database                    ./task reset-db
  Clean containers, cache, etc...   ./task clean
```

## Email, Captchas, YouTube

A few additional steps are required to work with email, captchas and YouTube
when developing locally.

1.  Create an account with [Mailtrap](https://mailtrap.io/).

2.  Create an account with [hCaptcha](https://www.hcaptcha.com/).

3.  Create an API Key with YouTube API v3 access under
    [Google Developer Console](https://console.developers.google.com/).

4.  Copy `.env.example` to `.env`. Edit as needed using the credentials created
    in steps 1-3.

5.  Edit `/etc/hosts` (or the equivalent):

    ```
    127.0.0.1 pujas.test
    ```

6.  Restart Docker processes:

    ```sh
    docker-compose restart
    ```

7.  Finally, use the following URLs when browsing:

    - Frontend: http://pujas.test:3000/
    - Backend: http://pujas.test:1337/admin/

## Server Setup

See the [server documentation](server/README.md).
