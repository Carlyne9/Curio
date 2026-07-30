# Curio — Backend Architecture

Status: Draft  
Version: 0.1  
Scope: MVP One

---

## 1. Backend Goals

The backend should make learning sessions safe, recoverable, and easy to archive.

MVP One should prioritize:

- Authenticated user ownership
- Reliable autosave
- Simple relational data model
- Clear session completion rules
- AI review generation after reflection
- Graceful failure handling

---

## 2. Recommended Stack

- `Supabase Auth` for authentication
- `Supabase Postgres` for relational data
- `Supabase Row Level Security` for ownership protection
- `Supabase Storage` later for recordings and uploads
- `Next.js Server Actions` for MVP mutations
- `OpenAI` via `Vercel AI SDK` for structured AI feedback
- `Zod` for input validation

---

## 3. Data Model

Initial migration:

- `supabase/migrations/0001_initial_schema.sql`

MVP tables:

- `topics`
- `challenges`
- `research_sessions`
- `notes`
- `sources`
- `key_claims`
- `reflections`
- `ai_feedback`

Deferred tables:

- `recordings`
- `videos`
- `collections`
- `achievements`
- `analytics_events`
- `public_profiles`

---

## 4. Ownership Model

User-owned tables should be protected by Supabase Row Level Security.

User-owned records:

- `research_sessions`
- `notes`
- `sources`
- `key_claims`
- `reflections`
- `ai_feedback`

Public/readable records:

- `topics`
- `challenges`

Rules:

- Users can only manage their own sessions.
- Child records inherit access through their parent session.
- Service role keys must never be exposed to the browser.

---

## 5. Server Action Plan

Initial file:

- `src/app/(app)/workspace/actions.ts`

Required actions:

- `startSession`
- `updateSession`
- `autosaveNotes`
- `addSource`
- `updateSource`
- `deleteSource`
- `addKeyClaim`
- `updateKeyClaim`
- `deleteKeyClaim`
- `submitReflection`
- `generateAiReview`
- `completeSession`

Server action rules:

- Validate all inputs with `Zod`.
- Check authenticated user before database writes.
- Never trust client-provided `user_id`.
- Return typed success/error objects rather than throwing user-facing errors.
- Keep AI calls server-side only.

---

## 6. Completion Rules

A session can be completed when:

- User is authenticated.
- Session belongs to the user.
- At least one source exists.
- Required reflection fields are filled.
- Notes have been saved at least once.

AI review should be attempted after reflection, but AI failure should not block session saving.

---

## 7. AI Review

Initial file:

- `src/lib/ai/review.ts`

Input:

- Topic
- Challenge
- Notes text
- Sources
- Reflection

Output:

- Summary
- Strengths
- Gaps
- Follow-up questions
- Suggested topics

Rules:

- Use structured output validation.
- Keep prompts short and product-specific.
- Do not send unnecessary private user data.
- Store generated feedback with the completed session.
- Allow retry if generation fails.

---

## 8. Storage Plan

Storage is not required for MVP One unless uploads are re-scoped.

Future buckets:

- `voice-notes`
- `video-recordings`
- `note-images`
- `exports`

Default privacy:

- Private by default
- Signed URLs for temporary access
- User-scoped paths

---

## 9. Environment Variables

Required for local development:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`

Rules:

- Keep `.env.local` out of git.
- Use `.env.example` as the shared template.
- Never expose service role keys to client components.

---

## 10. Backend Build Milestones

### Milestone 1: Supabase Project

- Create Supabase project.
- Add auth providers.
- Apply initial migration.
- Seed starter topics and challenges.

### Milestone 2: Auth Wiring

- Implement login.
- Implement sign-up.
- Protect app routes.
- Confirm session reads server-side.

### Milestone 3: Session Persistence

- Create sessions.
- Autosave notes.
- Add sources.
- Add key claims.
- Submit reflections.
- Complete sessions.

### Milestone 4: AI Feedback

- Generate structured feedback.
- Store feedback.
- Handle AI failure.
- Support retry.

### Milestone 5: Library Reads

- Query completed sessions.
- Render library cards.
- Add basic search.
- Open session detail.
