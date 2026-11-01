# Vercel deployment and XAMPP testing

The same source runs locally with XAMPP and online with Vercel. Each environment has its own database and uploads. Local records are not automatically synchronized to production.

## Vercel settings

This repository uses Vercel's Container preset, following its PHP/FrankenPHP guide:
https://vercel.com/kb/guide/deploy-php-on-vercel-with-docker

Import this GitHub repository. Select **Container** (the root `Dockerfile.vercel` also selects this preset), with Root Directory `.`. Remove previous Vite/Other build and output overrides. The Dockerfile installs Composer dependencies, builds Vite assets, copies bundled images and videos, and serves Laravel's `public` directory through FrankenPHP. There is no static output directory to enter. The web process listens on port 80; Vercel terminates HTTPS.

## External services required

1. A hosted MySQL database with TLS, reachable from Vercel. Keep XAMPP's `viernes_portfolio` exclusively for local tests. Use a separate hosted test database for preview deployments.
2. An S3-compatible bucket for uploaded project screenshots. Give the application credentials scoped to that bucket. Allow public **read** of project images using the provider's public asset domain; never allow anonymous writes. `AWS_URL` is that public asset URL. Configure the storage region and API endpoint supplied by the provider.

Original images and the profile video are bundled with the app. Newly uploaded images use object storage because container files are not durable across deployments or instances.

## Production environment variables

Set these in Vercel **Settings > Environment Variables**, scoped to Production. Never commit credentials or use production credentials in preview deployments.

| Variable | Value |
|---|---|
| APP_NAME | Justine Viernes Portfolio |
| APP_ENV | production |
| APP_DEBUG | false |
| APP_URL | Your final HTTPS domain, without trailing slash |
| APP_KEY | A new production key from `php artisan key:generate --show`; keep it stable |
| DB_CONNECTION | mysql |
| DB_HOST, DB_PORT | Hosted database endpoint and port |
| DB_DATABASE, DB_USERNAME, DB_PASSWORD | Hosted database credentials |
| MYSQL_ATTR_SSL_CA | `/etc/ssl/cert.pem` for providers using a public CA; for private CAs, configure the provider's certificate in the container |
| SESSION_DRIVER | database |
| SESSION_SECURE_COOKIE | true |
| CACHE_STORE | database |
| LOG_CHANNEL | stderr |
| QUEUE_CONNECTION | sync |
| PROJECT_UPLOAD_DISK | s3 |
| PORTFOLIO_OWNER_EMAIL | Your owner login email |
| PORTFOLIO_OWNER_PASSWORD_HASH | Hash generated privately using the command below |
| AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY | Bucket-scoped credentials |
| AWS_DEFAULT_REGION | Region required by the provider |
| AWS_BUCKET | Bucket name |
| AWS_ENDPOINT | Provider's S3 API URL; omit for standard AWS S3 |
| AWS_URL | Public base URL for bucket images, without trailing slash |
| AWS_USE_PATH_STYLE_ENDPOINT | true or false, as required by the provider |

Generate the owner password hash in your own terminal:

```powershell
php artisan portfolio:password-hash
```

The command prompts without showing the password. Paste the resulting hash, without extra quotes, into Vercel. No registration endpoint exists. Visit `/login` to sign in, then `/projects` or the public portfolio to manage records. Visitors can view project records, while create/edit/delete controls and their endpoints require the owner online. Changing the owner email or password hash revokes existing owner sessions. Login is rate limited using the shared database cache.

## Initialize the hosted database

Use a trusted terminal with the **hosted** credentials, not XAMPP credentials. One option is a temporary ignored `.env.production` file and Docker Desktop:

```powershell
docker build -f Dockerfile.vercel -t viernes-portfolio .
docker run --rm --env-file .env.production viernes-portfolio php artisan migrate --force
docker run --rm --env-file .env.production viernes-portfolio php artisan db:seed --class=ProjectSeeder --force
```

Use an initially empty hosted database for the original five sample projects. Existing local edits and uploaded screenshots need a separate intentional data/file migration. Never run `migrate:fresh` against records you want to keep. Database migrations are explicit operator commands, not run on each HTTP request or container start. The sessions and cache tables are included in the existing migrations.

PowerShell `.env.production` example values must be raw values suitable for Docker `--env-file`: do not wrap the password hash in quotes. Delete the temporary secret file after setup or store it securely outside the repository. It is ignored by Git and excluded from the Docker context.

## Verify before sharing

After deployment, check `/up`, the public page, the 19–33 second circular video, and `/login`. A logged-out browser must be redirected to login on `/projects` and every mutation endpoint. Sign in and create, edit and delete a disposable project. Check inline validation, display-order conflicts and image loading. Redeploy and verify the test record/image persist before removing it. Confirm the local XAMPP database is unaffected. Do not report the live app verified until these checks pass against the actual hosted services.

## Local development remains XAMPP

Keep the existing local `.env` with `APP_ENV=local`, `DB_HOST=127.0.0.1`, local credentials, `SESSION_DRIVER=file`, `CACHE_STORE=file`, and `PROJECT_UPLOAD_DISK=public` (the default). Use `scripts/serve.ps1` as before. Local classroom controls remain available without login. To test owner protection locally, set `PORTFOLIO_AUTH_REQUIRED=true` and supply the owner email/hash in your local `.env`.

Local Docker verification requires Docker Desktop. If Docker is unavailable, PHP tests and the Vite build can still run, but the container build and live Vercel deployment remain unverified.
