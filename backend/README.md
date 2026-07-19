# Krishi AI — Backend

Django 5 + Django REST Framework backend for the Krishi AI agriculture
marketplace, using **PostgreSQL hosted on [Neon](https://neon.tech)**.

Pairs with the Next.js frontend in `krishi-ai-frontend` — the API base URL
the frontend should call is `http://localhost:8000/api/`.

## 1. Create your Neon database

1. Sign up / log in at https://neon.tech and create a new project (e.g. `krishi-ai`).
2. On the project dashboard, open **Connection Details** and copy the
   connection string. It looks like:
   ```
   postgresql://neondb_owner:AbCd1234@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Keep that string handy for step 3 below.

## 2. Set up the Python environment

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and paste your Neon connection string into `DATABASE_URL`, e.g.:

```
DATABASE_URL=postgresql://neondb_owner:AbCd1234@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Generate a real `SECRET_KEY` for anything beyond local dev:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 4. Run migrations

```bash
python manage.py migrate
```

This creates all tables (users, products, orders, payments, AI tool logs,
notifications, blog, contact, etc.) directly on your Neon database — no
local Postgres install needed.

## 5. Create an admin user (or use the seed command below)

```bash
python manage.py createsuperuser
```

## 6. (Optional) Seed demo data

Populates demo farmer/buyer/admin accounts, categories, products, and a
blog post — handy for wiring up the frontend before real data exists:

```bash
python manage.py seed_demo_data
```

This creates:
- `admin@krishiai.com` / `Admin@123`
- `farmer@krishiai.com` / `Farmer@123`
- `buyer@krishiai.com` / `Buyer@123`

## 7. Run the server

```bash
python manage.py runserver
```

API root: `http://localhost:8000/api/`
Django admin: `http://localhost:8000/admin/`
Swagger docs: `http://localhost:8000/api/docs/`

## API overview

| App | Base path | Covers |
|---|---|---|
| accounts | `/api/auth/` | register, login (JWT), verify email, forgot/reset password, `me` |
| products | `/api/products/` | categories, products (CRUD + moderation), reviews |
| orders | `/api/orders/` | cart, wishlist, checkout, order tracking |
| payments | `/api/payments/` | wallet, withdrawals, payment initiate/verify |
| ai_tools | `/api/ai/` | disease detection, price prediction, fertilizer & crop recommendation, chatbot |
| weather | `/api/weather/` | current weather + forecast (proxies OpenWeatherMap) |
| notifications | `/api/notifications/` | list, mark read |
| blog | `/api/blog/` | categories, posts |
| contact | `/api/contact/` | public contact form + admin inbox |
| analytics | `/api/analytics/` | admin dashboard stats, farmer sales stats |

Auth uses JWT (`djangorestframework-simplejwt`). Send
`Authorization: Bearer <access_token>` on authenticated requests. Get a
token pair from `POST /api/auth/login/` with `{ email, password }`, and
refresh with `POST /api/auth/login/refresh/`.

## Notes on what's mocked / needs a real backend later

- **AI tools** (`apps/ai_tools/engine.py`): disease detection, price
  prediction, fertilizer and crop recommendations, and the chatbot all use
  simple rule-based/random placeholder logic right now, matching the
  `setTimeout`-simulated responses on the frontend. The view layer already
  saves requests/results to the database and returns real JSON — swap the
  function bodies in `engine.py` for calls to your real trained models or
  an LLM API and nothing else needs to change.
- **Payments** (`apps/payments/views.py`): `InitiatePaymentView` /
  `VerifyPaymentView` are a mock gateway (COD auto-succeeds; other methods
  are marked pending until "verified"). Swap in real eSewa/Khalti/Stripe
  calls when you're ready.
- **Weather**: proxies OpenWeatherMap — set `OPENWEATHER_API_KEY` in `.env`.

## Deployment

Intentionally not set up yet (per the frontend README) — `requirements.txt`
already includes `gunicorn` and `whitenoise` so this is ready to deploy to
Render/Railway/Fly/etc. against the same Neon database when you get there.
