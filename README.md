# Coding Spy

**Decode. Learn. Master.**

Coding Spy is an interactive, W3Schools-style tutorial platform with a spy/detective-themed premium UI: 47 pre-loaded curriculum topics ("Case Files"), a live in-browser code playground ("The Lab") with a real terminal, quizzes, downloadable PDF certificates ("Agent Certification"), AI-powered code hints ("Request Intel"), and an admin dashboard ("Mission Control").

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom spy theme tokens) + a small in-house UI kit (button/card/input/badge/progress)
- PostgreSQL + Prisma ORM
- NextAuth v4 — email/password (Credentials) + Google OAuth, JWT sessions, `ADMIN`/`LEARNER` roles
- Monaco Editor for code editing
- HTML/CSS/JS execution in a sandboxed `<iframe>` (no `allow-same-origin`, no main-thread `eval`); Python execution via Pyodide (WASM), loaded from the jsDelivr CDN on demand
- xterm.js terminal streaming console output/errors from the sandbox (errors in red)
- react-markdown + remark-gfm for lesson content
- Recharts for the admin dashboard
- @react-pdf/renderer for certificate PDFs
- AI hints via a small provider-agnostic adapter (`lib/ai/adapter.ts`) that calls the Anthropic Messages API when `ANTHROPIC_API_KEY` is set, with a graceful canned-hint fallback otherwise, plus simple in-memory rate limiting

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in at minimum `DATABASE_URL` (a PostgreSQL connection string) and `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`). `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and `ANTHROPIC_API_KEY` are optional — omitting them disables Google sign-in and switches AI hints to the fallback responses.

### 3. Create the database schema

```bash
npx prisma migrate dev --name init
```

(Or `npm run db:push` for a quick schema push without a migration history.)

### 4. Seed the curriculum

```bash
npm run db:seed
```

This loads all 47 topics (HTML through Machine Learning), their chapters/lessons, starter code, and per-topic quizzes, plus one admin account:

- **Email:** `admin@codingspy.dev`
- **Password:** `ChangeMe123!`

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign in with the admin account above to reach **Mission Control** at `/admin`.

## Scripts

| Command              | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start the dev server                      |
| `npm run build`       | Production build                          |
| `npm run start`       | Run the production build                  |
| `npm run typecheck`   | `tsc --noEmit`                             |
| `npm run db:generate` | Regenerate the Prisma client               |
| `npm run db:push`     | Push the Prisma schema without a migration |
| `npm run db:migrate`  | Create/apply a dev migration                |
| `npm run db:seed`     | Run `prisma/seed.ts`                        |

## Project structure

```
app/
  (auth)/login, (auth)/signup     — auth pages
  case-files/[topicSlug]/...      — learner topic + lesson pages (sidebar, markdown, playground, quiz)
  admin/                          — Mission Control dashboard + Case File manager
  verify/[code]                   — public certificate verification page
  api/                            — auth, admin CRUD, lessons progress, quiz submit,
                                     certificate issue/PDF, verify, AI hint routes
components/
  playground/                    — Monaco + iframe sandbox + xterm terminal + Pyodide runner
  admin/                          — topic/chapter/lesson manager, lesson editor, quiz builder, stats chart
  ui/                             — small Tailwind-based UI primitives
lib/
  auth.ts, requireAdmin.ts        — NextAuth config + role guards
  ai/adapter.ts, ai/rateLimit.ts  — AI hint provider + rate limiting
  prisma.ts, utils.ts             — Prisma client singleton, shared helpers
prisma/
  schema.prisma                   — full data model
  seed.ts                         — seeds all 47 topics + admin user
```

## Known gaps / notes

- **Runnable vs. display-only playgrounds:** HTML, CSS, JavaScript, W3.CSS, Bootstrap, "How To", jQuery, DSA, Python, Intro to Programming, AI, and Generative AI lessons execute live in the browser. Topics that need packages Pyodide doesn't preload (NumPy/Pandas/SciPy/Django/Data Science/Machine Learning) or that need a real compiler/runtime (Java, C, C++, C#, Go, Rust, Kotlin, Swift, PHP, SQL dialects, Bash, etc.) are shown as read-only reference code in the same editor, with a note in the UI.
- **Seed content** is intentionally concise and template-generated per chapter (heading, explanation, bullet list, code block, tip callout) to cover the full 47-topic curriculum. Treat it as a solid, complete starting point — expand any lesson further from the admin dashboard's lesson editor.
- **No live database was available in the build/verification environment** — `npx tsc --noEmit` and `npm run build` both pass cleanly, but running the seed script and exercising the app end-to-end requires pointing `DATABASE_URL` at a real Postgres instance.
- Image upload (`/api/admin/upload`) and `topics/reorder` (drag-to-reorder) endpoints exist; wiring a drag handle into the admin UI is a good next increment if needed.
