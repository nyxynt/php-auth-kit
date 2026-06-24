# PHP Auth Kit

A small Laravel Sanctum auth API with a static browser frontend for testing registration, login, authenticated user lookup, and logout.

## Project Layout

- `backend/` - Laravel API with Sanctum token authentication.
- `frontend/` - Static HTML, CSS, and JavaScript client.

## Requirements

- PHP 8.3 or newer
- Composer
- Python 3, only used to serve the static frontend locally

## Run The Backend

```powershell
cd backend
composer install
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

The API will be available at:

```text
http://127.0.0.1:8000/api
```

## Run The Frontend

Open a second terminal:

```powershell
cd frontend
python -m http.server 5173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173/login.html
```

## API Endpoints

- `POST /api/register` - Create a user and return a bearer token.
- `POST /api/login` - Sign in and return a bearer token.
- `GET /api/me` - Return the authenticated user.
- `POST /api/logout` - Revoke the current token.

Protected endpoints require:

```text
Authorization: Bearer <token>
```

## Tests

```powershell
cd backend
php artisan test
```
