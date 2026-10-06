# API architecture

Authentication is served by FastAPI at `/api/auth`.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/register` | Create a student account and set session cookies. |
| POST | `/login` | Verify credentials and set session cookies. |
| POST | `/logout` | Clear session cookies. |
| GET | `/me` | Return the authenticated student. |
| POST | `/forgot-password` | Return a privacy-safe reset-request response. |
| POST | `/reset-password` | Reserved until reset-token delivery is implemented. |

JWTs are never returned in JSON. The API writes access and refresh tokens as HTTP-only, SameSite=Lax cookies.
