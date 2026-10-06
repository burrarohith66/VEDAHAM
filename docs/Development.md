# Development

Copy `.env.example` to an uncommitted root `.env`, then copy its frontend and backend values into `frontend/.env.local` and `backend/.env` respectively.

Start the frontend:

```powershell
cd frontend
pnpm install
pnpm dev
```

Start PostgreSQL, apply the migration, then start the API:

```powershell
docker compose --env-file .env -f docker/docker-compose.yml up -d postgres
Get-Content database/migrations/001_create_users.sql | docker compose --env-file .env -f docker/docker-compose.yml exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Run backend tests from `backend/` with `pytest`.
