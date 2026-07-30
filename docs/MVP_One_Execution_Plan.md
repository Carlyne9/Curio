# Curio — MVP One Execution Plan

Status: Planning complete, build not started

## Build Order

### Slice 1: Static Workspace UX

Goal: Make the Research Workspace feel real before wiring persistence.

Deliverables:

- App shell
- Workspace route
- Research, Reflect, and Review mode layout
- Timer UI
- Notes editor placeholder
- Sources drawer
- Key claims area
- AI coach drawer
- Session checklist
- Mobile-responsive structure

### Slice 2: Session Persistence

Goal: Save the user's session data reliably.

Deliverables:

- Supabase auth setup
- Research session creation
- Notes autosave
- Source CRUD
- Key claim CRUD
- Reflection submission
- Completion flow

### Slice 3: AI Review

Goal: Generate useful feedback after reflection.

Deliverables:

- AI review server action
- Structured AI response schema
- AI unavailable fallback
- Save-without-AI path
- Suggested follow-up topics

### Slice 4: Library Integration

Goal: Make completed sessions visible and useful.

Deliverables:

- Library route
- Saved session cards
- Topic detail page
- Search basics
- Session completion redirect

## MVP Non-Goals

- Voice recording
- Video recording
- Knowledge graph
- Public profiles
- Community features
- Advanced analytics
- Browser extension
- Offline mode

## First Build Decision

Start with Slice 1. It gives us the product feel quickly, exposes UX problems early, and avoids spending too much time wiring data before the learning flow feels good.
