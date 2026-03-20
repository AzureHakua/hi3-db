# Prometheus DB ⚔️

A fan-made database for Honkai Impact 3rd, providing a searchable reference for weapons, stigmata, AstralOps, and more. Built with Bun, Elysia.js, HTMX, and Turso.

[Live Site](https://hi3.azurehakua.moe) | [API Documentation](https://hi3.azurehakua.moe/openapi)

## Tech Stack

- **[Bun](https://bun.sh)** — JavaScript runtime
- **[Elysia.js](https://elysiajs.com)** — Backend framework
- **[Drizzle ORM](https://orm.drizzle.team)** — Database ORM
- **[Turso](https://turso.tech)** — Edge SQLite database
- **[HTMX](https://htmx.org)** — Frontend interactivity
- **[Tailwind CSS](https://tailwindcss.com)** — Styling
- **[Fly.io](https://fly.io)** — Hosting

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) 1.0+
- [Turso](https://turso.tech) account

### Installation

1. Clone the repository
```bash
git clone https://github.com/AzureHakua/hi3-db.git
cd hi3-db
```

2. Install dependencies
```bash
bun install
```

3. Create a `.env` file in the root directory
```
TURSO_CONNECTION_URL='libsql://your-database-url'
TURSO_AUTH_TOKEN='your-auth-token'
API_KEY='your-chosen-api-key'
```

4. Run migrations
```bash
bun run drizzle-kit generate
bun run drizzle-kit migrate
```

5. Start the development server
```bash
bun dev
```

## Project Structure
```
src/
├── backend/
│   ├── db/
│   │   ├── schema.ts         # Drizzle database schemas
│   │   ├── counts.ts         # Entity count queries
│   │   └── index.ts          # Database connection
│   └── routes/
│       ├── index.ts          # Barrel exports
│       ├── stigmata.ts       # Stigmata CRUD + search
│       ├── weapons.ts        # Weapon CRUD
│       └── astralops.ts      # AstralOps CRUD
├── components/
│   ├── index.ts              # Barrel exports
│   ├── Stigma.tsx            # Stigmata card
│   ├── StigmataList.tsx      # Stigmata grid
│   ├── Weapon.tsx            # Weapon card
│   ├── WeaponList.tsx        # Weapon grid
│   ├── AstralOp.tsx          # AstralOp card
│   ├── AstralOpList.tsx      # AstralOp grid
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── Topbar.tsx            # Top navigation
├── pages/
│   ├── Home.tsx
│   ├── Weapons.tsx
│   ├── Stigmata.tsx
│   ├── AstralOps.tsx
│   ├── Valkyries.tsx
│   └── About.tsx
├── layout.tsx                # Layout + UnderConstruction
├── styles/
│   └── tailwind.css
└── index.tsx                 # App entry + route registration
```

## API Endpoints

All endpoints are documented interactively at `/openapi`.

### Stigmata
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/stigmata` | Get stigmata | No |
| POST | `/api/stigmata` | Create stigmata | Yes |
| PATCH | `/api/stigmata/:id` | Update stigmata | Yes |
| DELETE | `/api/stigmata/:id` | Delete stigmata | Yes |

### Weapons
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/weapon` | Get weapons | No |
| POST | `/api/weapon` | Create weapon | Yes |
| PATCH | `/api/weapon/:id` | Update weapon | Yes |
| DELETE | `/api/weapon/:id` | Delete weapon | Yes |

### AstralOps
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/astralop` | Get AstralOps | No |
| POST | `/api/astralop` | Create AstralOp | Yes |
| PATCH | `/api/astralop/:id` | Update AstralOp | Yes |
| DELETE | `/api/astralop/:id` | Delete AstralOp | Yes |

### Query Parameters
```
GET /api/stigmata?name=Mei
GET /api/stigmata?id=1
GET /api/weapon?name=Mag-Typhoon&limit=5
```

## Stigmata Search Flags

The stigmata search supports special flags for advanced filtering:

| Flag | Description |
|------|-------------|
| `-single` or `-1` | Only stigmata with a single position |
| `-set` or `-3` | Only stigmata with all three positions (T/M/B) |
| `-t` / `-m` / `-b` | Filter by position |
| `-effect "term"` | Filter by skill or set effect description |
| `-id <number>` | Search by stigmata ID |

**Examples:**
```
mei -set                        → 3-piece Mei stigmata
-single -effect "physical"      → single-piece stigmata with physical in effect
bronya -m                       → Bronya stigmata with an M piece
-m -effect "fire"               → any M-piece with fire in its effect
```

## Deployment

The app is deployed on Fly.io and automatically deploys on push to `master` via GitHub Actions.
```bash
# Manual deploy
flyctl deploy
```

## Disclaimer

Prometheus DB is a fan-made project. All game data and assets belong to HoYoverse.
