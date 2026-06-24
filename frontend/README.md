# Frontend

Static HTML client for the PHP Auth Kit API.

## Pages

- `login.html` - Sign in and store the returned bearer token.
- `register.html` - Create an account and store the returned bearer token.
- `dashboard.html` - Load `/api/me`, show the current user, copy the token, and log out.
- `auth.js` - Shared API client and local token storage.
- `styles.css` - Shared styling.

## Run

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/login.html
```

## Backend URL

The frontend defaults to:

```text
http://127.0.0.1:8000/api
```

You can change this from the "API settings" section on the login, register, or dashboard pages. The value is saved in `localStorage`.

## Token Storage

The browser stores the bearer token in `localStorage` under:

```text
php_auth_kit_token
```

Logging out calls `/api/logout` and clears the local token.
