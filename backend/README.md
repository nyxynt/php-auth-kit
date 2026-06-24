# Backend

Laravel API for the PHP Auth Kit. It uses Sanctum personal access tokens for stateless bearer-token authentication.

## Setup

```powershell
composer install
php artisan migrate
```

The default local database is SQLite. If `database/database.sqlite` does not exist, create it before running migrations.

## Run

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

Base API URL:

```text
http://127.0.0.1:8000/api
```

## Endpoints

### Register

```http
POST /api/register
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

Returns `201` with:

```json
{
  "user": {},
  "token": "plain-text-token"
}
```

### Login

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Returns the authenticated user and token.

### Current User

```http
GET /api/me
Authorization: Bearer <token>
```

Returns the authenticated user.

### Logout

```http
POST /api/logout
Authorization: Bearer <token>
```

Revokes the current token.

## Tests

```powershell
php artisan test
```
