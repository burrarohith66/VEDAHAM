# Database architecture

PostgreSQL is Vedaham's primary database. The initial authentication migration at `database/migrations/001_create_users.sql` creates the `users` table only. Migrations and seeds remain separately owned under `database/`.
