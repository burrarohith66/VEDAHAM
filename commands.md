# Vedaham terminal commands

These copy-paste commands are for **Windows PowerShell**. Run commands from the repository root unless a section says otherwise. Open separate terminals for the frontend and backend because each development server stays running.

## 1. First-time local setup

Create local environment files only if they do not already exist, so this does not overwrite existing settings:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path backend\.env)) { Copy-Item backend\.env.example backend\.env }
if (-not (Test-Path frontend\.env.local)) { Copy-Item frontend\.env.example frontend\.env.local }
```

Set matching PostgreSQL credentials in `.env` and `backend\.env`. The `DATABASE_URL` in `backend\.env` must use the same database, user, and password configured in `.env`. Keep the JWT secret in `backend\.env` at least 32 characters long. These files contain local secrets; do not commit them.

Check the required tools:

```powershell
node --version
pnpm --version
docker --version
docker compose version
py --version
```

## 2. Start PostgreSQL and create the initial table

Start the PostgreSQL container:

```powershell
docker compose --env-file .env -f docker/docker-compose.yml up -d postgres
```

Check its status:

```powershell
docker compose --env-file .env -f docker/docker-compose.yml ps
```

Apply the initial users-table migration (safe to re-run; it uses `IF NOT EXISTS`):

```powershell
Get-Content .\database\migrations\001_create_users.sql | docker compose --env-file .env -f docker/docker-compose.yml exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

## 3. Inspect and retrieve database data

Open an interactive PostgreSQL prompt:

```powershell
docker compose --env-file .env -f docker/docker-compose.yml exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

At the `psql` prompt, useful commands include:

```sql
\dt
\d users
SELECT id, full_name, email, college, is_active, is_verified, created_at
FROM users
ORDER BY created_at DESC;
\q
```

Run a query directly from PowerShell without opening the prompt:

```powershell
docker compose --env-file .env -f docker/docker-compose.yml exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT id, full_name, email, college, is_active, is_verified, created_at FROM users ORDER BY created_at DESC;"'
```

The query intentionally omits password hashes. Treat any retrieved student data as sensitive.

## 4. Run the backend API

In a new terminal from the repository root:

```powershell
Set-Location backend
if (-not (Test-Path .venv\Scripts\python.exe)) { py -m venv .venv }
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

The interactive API documentation is at <http://localhost:8000/docs>.

## 5. Run the frontend

In another terminal from the repository root:

```powershell
Set-Location frontend
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## 6. Run tests and build the frontend

Backend tests:

```powershell
Set-Location backend
.\.venv\Scripts\python.exe -m pytest
```

Frontend production build:

```powershell
Set-Location frontend
pnpm build
```

## 7. Stop the local services

Stop the frontend and backend with `Ctrl+C` in their terminals. Stop PostgreSQL without deleting its persisted data:

```powershell
docker compose --env-file .env -f docker/docker-compose.yml down
```

The current database migration creates only the authentication `users` table. Redis, Neo4j, and the other planned platform features are not configured as running services.
