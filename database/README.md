# Database

PostgreSQL is Vedaham's primary database. The first migration creates only the authentication `users` table.

- `migrations/001_create_users.sql` creates the initial authentication schema.
- `seeds/` will contain development-only seed data when needed.

Apply the initial migration after PostgreSQL is running:

```powershell
Get-Content database/migrations/001_create_users.sql | docker compose --env-file .env -f docker/docker-compose.yml exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```
