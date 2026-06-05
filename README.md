# Potter CRM

A CRM for witches and wizards — manage clients, magical offerings, contracts, and payments.

Built with **Next.js 15** (App Router, Server Actions), **Prisma**, **Postgres**, **Auth.js (NextAuth v5)**, and **Tailwind CSS**. Multi-tenant — each practitioner sees only their own data.

## Features

- **Clients** — contacts with magical contracts
- **Offerings** — your catalogue of curses, enchantments, potions, services
- **Contracts** — bind a client to one or more offerings; per-item price snapshots so editing an offering later doesn't rewrite history
- **Payments** — record receipts against contracts; track outstanding balance
- **Dashboard** — counts, outstanding balance, recent payments
- **Auth** — email/password signup + login; sessions via JWT

## Getting started

### Prerequisites

- Node 22+ and npm
- Docker (for local Postgres)

### Setup

```bash
# 1. Install deps
npm install

# 2. Start local Postgres
docker compose up -d

# 3. Configure env
cp .env.example .env
# Then fill in AUTH_SECRET — generate with: openssl rand -base64 32

# 4. Migrate + seed
npm run db:migrate
npm run db:seed

# 5. Run
npm run dev
```

Open <http://localhost:3000>. The seed user is:

- **Email:** `merlin@example.com`
- **Password:** `password123`

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

## Architecture

```
app/
├── (auth)/             # login + signup (public)
├── (app)/              # auth-gated app shell with sidebar nav
│   ├── dashboard/
│   ├── clients/
│   ├── offerings/
│   ├── contracts/
│   └── payments/
└── api/auth/[...nextauth]/

lib/
├── auth.ts             # NextAuth config + requireUser()
├── prisma.ts           # Prisma client singleton
├── db/                 # tenant-scoped data access (userId always required)
├── actions/            # Server Actions (with Zod validation)
├── validation/         # Zod schemas
├── money.ts            # cents <-> display helpers
└── contract-math.ts    # total/paid/balance helpers

components/
├── ui.tsx              # Button, Input, Card, Badge, etc.
├── nav.tsx             # sidebar
├── page-header.tsx
└── forms/              # one form per domain entity

prisma/
├── schema.prisma
└── seed.ts
```

### Conventions

- **Tenant isolation** lives in `lib/db/*`. Every function takes `userId` as its first argument; pages and actions get it from `requireUser()`. No raw Prisma calls in pages.
- **Money is integer cents.** Format via `lib/money.ts`.
- **Contract items snapshot price** at creation, so later edits to an offering's price never rewrite contract history.
- **Server Actions only** for mutations. No REST routes for app data — only `/api/auth/*` for NextAuth.

## Not yet included

- Real payment processing (Stripe etc.) — manual tracking only.
- Email notifications / reminders.
- Tests, CI, deploy config.
- Audit log / soft deletes.
