# Curio — Owner Setup Checklist

Use this checklist to prepare the services and credentials needed before active MVP development.

---

## 1. Local Machine

Install or confirm:

- `Node.js` version `24.x`
- `npm`
- Git, if you want version history
- A code editor

Recommended commands after dependencies are approved:

```bash
npm install
npm run dev
```

---

## 2. Supabase

Create a Supabase project.

You will need:

- Project URL
- Public anon key
- Service role key
- Database password

Add these to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Setup tasks:

- Enable email/password auth.
- Configure redirect URLs for local development.
- Apply `supabase/migrations/0001_initial_schema.sql`.
- Confirm Row Level Security policies are enabled.
- Add seed topics and challenges.

Google account sign-in:

- Create a Google OAuth web client in Google Cloud Console.
- Add `https://gfxmzwphxtceagulvhrn.supabase.co/auth/v1/callback` as an authorized redirect URI.
- Enable Google under Supabase Authentication → Providers.
- Paste the Google client ID and client secret into the Supabase Google provider.
- Keep the local and production Curio callback URLs in the Supabase redirect allow list.

Recommended local redirect URL:

```txt
http://localhost:3000/auth/callback
```

Production URLs:

```txt
https://curio-lemon-five.vercel.app
https://curio-lemon-five.vercel.app/auth/callback
```

---

## 3. OpenRouter

Create or use an OpenRouter account.

You will need:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

Add it to `.env.local`:

```bash
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/free
```

MVP usage:

- AI session summary
- Understanding strengths
- Knowledge gaps
- Follow-up questions
- A revision request when the notes do not align with the research topic

---

## 4. Vercel

The production project is deployed at `https://curio-lemon-five.vercel.app`.

You will eventually need:

- Vercel account
- Project connected to the repo
- Environment variables copied into Vercel
- Production Supabase site and redirect URLs

Do not add `SUPABASE_SERVICE_ROLE_KEY` to Vercel. It is only needed by the local setup scripts.

---

## 5. Product Decisions Needed

Before implementation, decide:

- Should timer use `25` and `50` minutes only for MVP?
- Should one source be required for every session?
- Should AI review run automatically after reflection?
- Should users be allowed to save without AI feedback?
- Should sign-up be email/password only for MVP?
- What are the first 20–50 seed topics?

---

## 6. Design Assets Needed

Not required before coding, but useful soon:

- Logo or wordmark direction
- Preferred app name casing: `Curio`, `CURIO`, or another style
- Any favorite product references
- Any colors you strongly like or dislike
- Tone examples for AI coach feedback

---

## 7. Current Repo Status

Already created:

- Next.js application and protected routes
- Supabase authentication, persistence, Row Level Security, and private Storage
- Guided category, difficulty, wheel, and timer onboarding
- Rich-text and handwritten-note workspace
- Editable sources and key claims
- Reflection and OpenRouter AI coaching
- Searchable library and session details
- Automated unit tests and production build checks
- Ordered Supabase migrations
- MVP feature spec
- Frontend and backend architecture docs
- Design system draft
