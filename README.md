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

The current implementation is a starter scaffold only. It does not yet include real authentication, database persistence, editor behavior, or AI calls wired into UI actions.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible component structure
- Supabase Auth, PostgreSQL, and Storage
- Tiptap rich text editor
- OpenAI via Vercel AI SDK
- Zod for validation

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

## Important Files

- `docs/Curio_Feature_Spec_Research_Workspace_MVP_v0.2.md` — lean feature spec
- `docs/MVP_One_Execution_Plan.md` — build slices and order
- `docs/Design_System.md` — design system draft
- `docs/Design_System_Notes.md` — early visual and UX principles
- `docs/Frontend_Architecture.md` — frontend architecture plan
- `docs/Backend_Architecture.md` — backend architecture plan
- `docs/Owner_Setup_Checklist.md` — services and credentials to prepare
- `supabase/migrations/0001_initial_schema.sql` — initial database schema
- `src/components/workspace/research-workspace-shell.tsx` — static workspace UX shell
- `src/lib/supabase` — Supabase client placeholders
- `src/lib/ai/review.ts` — AI review service placeholder

## Next Step

The next recommended step is Slice 1: convert the static workspace shell into interactive UI state for research, reflection, and review modes.
