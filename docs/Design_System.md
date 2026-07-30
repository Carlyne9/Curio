# Curio — Design System

Status: Draft  
Version: 0.1  
Scope: MVP One

---

## 1. Design Intent

Curio should feel like a calm learning room: focused, warm, lightly playful, and premium without becoming sterile.

The design system should support the core learning loop:

Spin → Focus → Research → Reflect → Review → Archive

Every visual decision should help users feel:

- Clear about what to do next
- Safe to think messily
- Motivated to finish
- Proud of what they learned

---

## 2. Brand Keywords

- Calm
- Focused
- Playful
- Premium
- Minimal
- Curious
- Reflective

---

## 3. Color System

### Core Palette

| Token | Usage | Suggested Value |
| --- | --- | --- |
| `background` | Main app background | `#FBFAF7` |
| `foreground` | Primary text | `#1F2430` |
| `card` | Panels and elevated surfaces | `#FFFDF8` |
| `muted` | Soft backgrounds | `#F0ECE5` |
| `muted-foreground` | Secondary text | `#6F6A63` |
| `border` | Dividers and outlines | `#E2DACF` |
| `primary` | Main action, focus states | `#6457F9` |
| `primary-foreground` | Text on primary | `#FFFFFF` |
| `accent` | Delight, highlights, rewards | `#F7C873` |
| `accent-foreground` | Text on accent | `#2C2617` |
| `destructive` | Errors and destructive states | `#D94B4B` |
| `ring` | Focus outline | `#8B7FFF` |

### Color Principles

- Use warm neutrals for calm.
- Use violet for progress, intelligence, and primary actions.
- Use amber sparingly for delight and achievement.
- Avoid large high-saturation areas during focus sessions.
- Preserve WCAG AA contrast for all text.

---

## 4. Typography

### Font

Primary font:

- `Inter`

Fallback:

- `ui-sans-serif`
- `system-ui`
- `sans-serif`

### Type Scale

| Role | Suggested Classes |
| --- | --- |
| Display | `text-5xl sm:text-7xl font-semibold tracking-tight` |
| Page title | `text-3xl font-semibold tracking-tight` |
| Section title | `text-base font-semibold` |
| Body | `text-base leading-7` |
| Small body | `text-sm leading-6` |
| Label | `text-sm font-medium` |
| Eyebrow | `text-sm font-semibold uppercase tracking-[0.25em]` |

### Typography Principles

- Use generous line-height for learning content.
- Avoid dense blocks inside the workspace.
- Keep labels short and action-oriented.
- Make reflection prompts feel conversational, not clinical.

---

## 5. Spacing And Shape

### Spacing

Use spacious layouts to reduce cognitive load:

- Small gaps: `0.5rem–0.75rem`
- Component gaps: `1rem–1.25rem`
- Section gaps: `1.5rem–2rem`
- Page padding: `1.5rem–2rem`

### Radius

Curio should use soft, rounded surfaces:

- Small controls: `rounded-full`
- Cards: `rounded-3xl`
- Large panels: `rounded-[2rem]`
- Editor surface: `rounded-[1.5rem]`

---

## 6. Motion

Motion should guide attention, not perform for its own sake.

### Use Motion For

- Topic wheel spin
- Drawer open/close
- Session mode transitions
- Completion celebration
- Autosave confirmation

### Avoid Motion For

- Critical error messaging
- Constant background animation during focus
- Decorative loops that distract from reading or writing

### Accessibility

- Respect reduced-motion preferences.
- Do not communicate state with motion alone.

---

## 7. Core Components

### Button

Variants:

- Primary
- Secondary
- Ghost
- Destructive

States:

- Default
- Hover
- Focus
- Disabled
- Loading

### Card

Used for:

- Dashboard stats
- Workspace panels
- Library session cards
- Reflection summaries
- AI feedback

### Input

Used for:

- Source URL
- Source title
- Search
- Short reflection fields

### Textarea

Used for:

- Reflection prompts
- Source notes
- Key claims before rich editor integration

### Drawer / Sheet

Used for:

- Sources on mobile
- AI coach on mobile
- Key claims on mobile
- Session checklist

### Timer

States:

- Idle
- Running
- Paused
- Completed
- Finished early

### Checklist

Used to show:

- Start timer
- Add notes
- Add one source
- Reflect
- Review AI feedback
- Save session

---

## 8. Research Workspace UX Rules

### Default Priority

The notes editor is the primary surface.

Everything else should support the user's thinking without competing for attention.

### Desktop Layout

- Header: topic, challenge, timer, progress
- Left drawer/panel: sources and key claims
- Center: notes editor
- Right drawer/panel: AI coach and checklist
- Sticky footer: save status and finish action

### Mobile Layout

- Single-column layout
- Timer pinned near top
- Notes first
- Sources, claims, checklist, and AI coach behind tabs or bottom sheets
- Sticky finish action at bottom

### Completion Flow

Research Mode → Reflect Mode → Review Mode → Library

Users should not feel trapped. If AI fails, they can still save.

---

## 9. Empty State Voice

Curio's empty states should sound helpful and lightly encouraging.

Examples:

- Notes: “Start with one insight, question, or thing you want to understand.”
- Sources: “Add the first article, video, paper, or page you used.”
- Key claims: “Capture one claim you believe is important.”
- AI Coach: “When you're ready, I can summarize, question, or challenge your understanding.”

---

## 10. Accessibility Baseline

MVP One must include:

- Keyboard navigable controls
- Visible focus states
- Semantic headings
- Form labels
- Screen-reader labels for icon-only controls
- WCAG AA color contrast
- Reduced-motion support
- No motion-only feedback

---

## 11. Design Debt To Track

- Final logo and wordmark
- Illustration style
- Dark mode
- Achievement visuals
- Topic wheel motion details
- Empty library illustration
- Full component states
- Mobile bottom-sheet interaction details
