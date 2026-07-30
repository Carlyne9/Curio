# Curio — Frontend Architecture

Status: Draft  
Version: 0.1  
Scope: MVP One

---

## 1. Frontend Goals

The frontend should make Curio feel calm, focused, and easy to complete.

MVP One should prioritize:

- Fast route navigation
- Clear session state
- Reliable autosave feedback
- Responsive mobile-first layouts
- Accessible interactive components
- Clean separation between UI, validation, and server actions

---

## 2. Recommended Stack

- `Next.js` App Router
- `React`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui` style component structure
- `Framer Motion` for meaningful transitions
- `Tiptap` for rich text notes
- `Zod` for form and action validation
- `Supabase SSR` for authenticated data access

---

## 3. Folder Structure

```txt
src/
  app/
    (auth)/
      login/
      onboarding/
      sign-up/
    (app)/
      dashboard/
      library/
      workspace/
    globals.css
    layout.tsx
    page.tsx
  components/
    layout/
    ui/
    workspace/
  data/
  lib/
    ai/
    supabase/
    validations/
  types/
```

---

## 4. Route Plan

### Public Routes

- `/` — landing page
- `/login` — login placeholder
- `/sign-up` — sign-up placeholder

### App Routes

- `/onboarding` — guided first-session introduction
- `/dashboard` — returning user home
- `/workspace` — MVP research workspace
- `/library` — saved session list

### Future Routes

- `/spin`
- `/library/[sessionId]`
- `/profile`
- `/settings`
- `/analytics`

---

## 5. Component Plan

### Layout Components

- `AppShell`
- `Header`
- `Navigation`
- `MobileNav`

### UI Components

- `Button`
- `Card`
- `Input`
- `Textarea`
- `Badge`
- `Dialog`
- `Drawer`
- `Tabs`
- `Progress`
- `Toast`

### Workspace Components

- `ResearchWorkspaceShell`
- `WorkspaceHeader`
- `FocusTimer`
- `NotesEditor`
- `SourcesPanel`
- `KeyClaimsPanel`
- `SessionChecklist`
- `AiCoachPanel`
- `ReflectionForm`
- `AiReviewPanel`
- `CompletionActions`

---

## 6. State Model

The workspace should use explicit session modes:

```ts
type WorkspaceMode = "research" | "reflect" | "review";
```

Key UI states:

- Timer state: idle, running, paused, completed
- Autosave state: idle, saving, saved, failed
- AI review state: idle, loading, completed, failed
- Completion state: draft, active, reflecting, completed

---

## 7. Forms And Validation

Use `Zod` schemas in `src/lib/validations`.

Initial schemas:

- `sourceSchema`
- `keyClaimSchema`
- `reflectionSchema`
- `completeSessionSchema`

Form UX rules:

- Validate on submit.
- Show short, plain-language errors.
- Preserve user input after failures.
- Never block note-taking because a source or reflection is missing.
- Enforce requirements only during completion.

---

## 8. Rich Text Editor

Use `Tiptap` for notes.

MVP editor features:

- Paragraphs
- Headings
- Bold
- Italic
- Bullet lists
- Numbered lists
- Quotes
- Links

Defer:

- Tables
- Math blocks
- Image uploads
- Advanced slash menu
- Collaborative editing

Persist:

- `content_json` for rendering/editing
- `content_text` for search and AI review

---

## 9. Autosave UX

Autosave should be debounced and visible.

Suggested states:

- `Saving...`
- `Saved`
- `Unable to save`
- `Retrying...`

Rules:

- Autosave notes quietly while the user types.
- Show a persistent status near the finish action.
- Allow users to copy notes if save repeatedly fails.

---

## 10. Accessibility

Frontend implementation should include:

- Semantic page landmarks
- Heading hierarchy per route
- Keyboard navigable modals/drawers
- Accessible timer controls
- Visible focus rings
- Labels for every form field
- Reduced-motion support

---

## 11. Frontend Build Milestones

### Milestone 1: Static UX

- Complete responsive workspace layout.
- Add research, reflect, and review modes.
- Add placeholder components for panels and editor.

### Milestone 2: Interactive UI

- Add timer state.
- Add source and key claim local state.
- Add reflection form.
- Add completion checklist logic.

### Milestone 3: Persistence Wiring

- Connect auth.
- Connect Server Actions.
- Connect Supabase queries.
- Add autosave.

### Milestone 4: AI And Library

- Trigger AI review.
- Show AI feedback.
- Save completed sessions.
- Render library entries.
