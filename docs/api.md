# Shared Backend API Contract

Both `apps/api-nest` (default `:3000`) and `apps/api-python` (default `:8000`) implement the exact same REST + JWT contract consumed by `@nx-vite-vercel/dal`.

Interactive Swagger / OpenAPI UI is served at:

- NestJS: `http://localhost:3000/docs`
- FastAPI: `http://localhost:8000/docs`

## Endpoints

### `GET /health`

Returns service readiness and timestamp:

```json
{
  "status": "ok",
  "service": "api-nest",
  "timestamp": "2026-11-20T20:00:00.000Z"
}
```

### `POST /auth/register`

Creates a standard `user` account and returns a JWT.

Request:

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "Regular User"
}
```

Response (`201 Created`):

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresInSeconds": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Regular User",
    "role": "user",
    "createdAt": "2026-11-20T20:00:00.000Z"
  }
}
```

### `POST /auth/login`

Authenticates email + password and returns `AuthResponse`.
Default seeded dev admin (configurable via `.env`): `admin@example.com` / `Admin123!`.

### `GET /auth/me`

Header: `Authorization: Bearer <jwt>`
Returns the authenticated `UserProfile`.

### `GET /admin/stats`

Header: `Authorization: Bearer <admin-jwt>`
Returns `{ totalUsers, adminUsers, service, uptimeSeconds }`. Returns `403` for non-admin users.

### `GET /admin/users`

Header: `Authorization: Bearer <admin-jwt>`
Returns `UserProfile[]`. Returns `403` for non-admin users.
