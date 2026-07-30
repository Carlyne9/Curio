# Curio — Owner Setup Checklist

Use this checklist to prepare the services and credentials needed before active MVP development.

---

## 1. Local Machine

Install or confirm:

- `Node.js` version `20.9.0` or newer
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

Recommended local redirect URL:

```txt
http://localhost:3000/auth/callback
```

Production redirect URL can be added after deployment.

---

## 3. OpenAI

Create or use an OpenAI platform account.

You will need:

- `OPENAI_API_KEY`

Add it to `.env.local`:

```bash
OPENAI_API_KEY=
```

MVP usage:

- AI session summary
- Understanding strengths
- Knowledge gaps
- Follow-up questions
- Suggested related topics

---

## 4. Vercel

Vercel is recommended for deployment, but not required for local build work.

You will eventually need:

- Vercel account
- Project connected to the repo
- Environment variables copied into Vercel
- Production Supabase redirect URL

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

- Next.js starter config
- App route placeholders
- Static Research Workspace shell
- Supabase client placeholders
- AI review placeholder
- Initial Supabase migration
- MVP feature spec
- Frontend and backend architecture docs
- Design system draft
