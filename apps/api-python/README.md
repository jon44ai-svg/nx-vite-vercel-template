# Optional FastAPI API (`uv`)

Opt-in Python backend featuring:
- Dependency and environment management via `uv`
- Typed configuration via `pydantic-settings`
- Structured JSON logging via `structlog`
- SQLAlchemy + SQLite persistence
- Password + JWT authentication (`bcrypt` + `pyjwt`)
- Role-protected Admin endpoints (`/admin/stats`, `/admin/users`)
- Automatic OpenAPI / Swagger docs at `/docs`

## Quick Start

```bash
cd apps/api-python
cp .env.example .env
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Run tests:

```bash
uv run pytest
```
