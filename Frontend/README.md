# Krishi AI — Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 frontend for the Krishi AI
agriculture marketplace. This is the full UI, wired with mock data — no backend
yet, and deployment is intentionally left for a later step.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's included

- **Public site**: landing page, marketplace, AI tools hub (disease detection,
  price prediction, fertilizer recommendation, crop recommendation, chatbot),
  weather, about, contact, blog, pricing, FAQ
- **Auth**: login, signup, verify, forgot password, reset password
- **Farmer dashboard**: `/farmer/dashboard`, products, orders, analytics, wallet,
  notifications, profile, settings
- **Buyer dashboard**: `/buyer/dashboard`, wishlist, orders, cart, payments, profile
- **Admin panel**: `/admin/dashboard`, users, farmers, products, orders, payments,
  reports, AI models, weather, settings

## Project structure

```
src/
  app/
    (public)/      -> marketing site, shares Navbar + Footer + chatbot widget
    (auth)/        -> login/signup/etc, shares a centered auth card layout
    farmer/        -> farmer dashboard, shares a sidebar shell
    buyer/         -> buyer dashboard, shares a sidebar shell
    admin/         -> admin panel, shares a sidebar shell
  components/
    ui/            -> Button, Card, Badge, SectionHeading (design primitives)
    shared/         -> Navbar, Footer, ProductCard, DashboardShell, DataTable, etc.
  data/mock.ts      -> placeholder data standing in for the Django API
```

## Notes for next steps

- All data currently comes from `src/data/mock.ts`. Swap these for real API
  calls (e.g. with React Query + Axios) once the Django backend exists.
- The AI pages (disease detection, chatbot, etc.) simulate a response with
  `setTimeout` — replace with real API calls when those endpoints are ready.
- Deployment (Vercel, Docker, etc.) is intentionally not set up yet.
