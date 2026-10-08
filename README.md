# Vedaham

Vedaham is an adaptive learning platform that connects academic learning, skills development, and career readiness. The current product surface is the preserved marketing landing page; the repository is structured for the application services that will be added in later work.

## Project structure

```text
frontend/   Next.js marketing site and future product UI
backend/    FastAPI service boundary and future AI-processing modules
database/   PostgreSQL migration and seed ownership
docs/       Architecture and development documentation
docker/     Future local service orchestration
```

## Frontend

The Next.js application lives in `frontend/`. Its landing page remains available at `/` and is composed from `frontend/components/marketing`.

```powershell
cd frontend
pnpm install
pnpm dev
```

## Backend and database

The first implemented backend capability is student authentication: registration, login, logout, authenticated-session lookup, and protected dashboard access. The remaining backend domains and AI services are still deliberately unimplemented.

The planned primary database is PostgreSQL. Future local infrastructure will be owned by `docker/`.

## AI architecture

Future AI capabilities are separated under `backend/app/ai` for tutoring, retrieval-augmented generation, syllabus parsing, exam intelligence, mastery, and recommendations. They are not implemented yet.

## Development workflow

1. Develop the user interface from `frontend/`.
2. Add backend behavior only when its feature is scheduled, using the existing service boundaries.
3. Add schema changes as reviewed migrations in `database/migrations/`.
4. Use `.env.example` as the public configuration contract; never commit real credentials.

See `docs/` for the current architectural notes, API contract, and startup instructions.
For copy-paste Windows PowerShell commands to configure, run, and inspect the project, see [`commands.md`](./commands.md).
