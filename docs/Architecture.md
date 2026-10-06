# Architecture

Vedaham is organized as a frontend application, a separate FastAPI backend, database ownership, and local infrastructure configuration. The implemented product includes the Next.js marketing site and student authentication.

Authentication is split into frontend form/API modules, domain-specific FastAPI routes and services, SQLAlchemy models, Pydantic schemas, and a single PostgreSQL migration. Future product pages, APIs, data models, and AI services remain deliberately unimplemented.
