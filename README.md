# Curio

Curio is a learning operating system that turns curiosity into focused research sessions, reflection, AI coaching, and a growing personal knowledge library.

## MVP One

The first build focuses on the core loop:

1. Choose or spin into a topic.
2. Start a focused research session.
3. Capture notes, sources, and key claims.
4. Reflect on what was learned.
5. Receive AI feedback.
6. Save the session to the library.

MVP One now includes the complete guided research loop: authentication, onboarding, a resilient focus timer, rich notes, private handwritten-note uploads, sources and claims, reflection, AI coaching, and a searchable session library.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible component structure
- Supabase Auth, PostgreSQL, and Storage
- Tiptap rich text editor
- OpenRouter via Vercel AI SDK
- Zod for validation
- Vitest for automated unit tests

## Getting Started

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Run release checks:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Apply every migration in `supabase/migrations` in filename order, seed the topic catalog, and create the private handwritten-note bucket:

```bash
npm run seed:topics
npm run setup:storage
```

`SUPABASE_SERVICE_ROLE_KEY` is used only by local setup scripts. Do not add it to Vercel or expose it to browser code.

## Production

- App: [curio-lemon-five.vercel.app](https://curio-lemon-five.vercel.app)
- Supabase Site URL: `https://curio-lemon-five.vercel.app`
- Supabase redirect URL: `https://curio-lemon-five.vercel.app/auth/callback`
- Vercel runtime variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENROUTER_API_KEY`, and `OPENROUTER_MODEL`

## Important Files

- `docs/Curio_Feature_Spec_Research_Workspace_MVP_v0.2.md` — lean feature spec
- `docs/MVP_One_Execution_Plan.md` — build slices and order
- `docs/Design_System.md` — design system draft
- `docs/Design_System_Notes.md` — early visual and UX principles
- `docs/Frontend_Architecture.md` — frontend architecture plan
- `docs/Backend_Architecture.md` — backend architecture plan
- `docs/Owner_Setup_Checklist.md` — services and credentials to prepare
- `supabase/migrations` — ordered database and policy migrations
- `src/components/onboarding/topic-discovery.tsx` — four-stage topic discovery flow
- `src/components/workspace/research-workspace-shell.tsx` — active research, reflection, and review workspace
- `src/app/(app)/library` — searchable library and session details
- `src/lib/supabase` — browser and server Supabase clients
- `src/lib/ai/review.ts` — aligned/off-topic AI coaching service

## Security

- `.env.local` and `.vercel` are permanently ignored by Git.
- Supabase Row Level Security protects user-owned records.
- Handwritten notes use a private Storage bucket and short-lived signed links.
- AI and storage credentials stay server-side.
