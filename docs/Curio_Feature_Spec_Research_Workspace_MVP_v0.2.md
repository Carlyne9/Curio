# Curio — Research Workspace MVP Spec

Version: 0.2  
Status: Ready for MVP planning  
Priority: MVP One  
Complexity: Medium-High

---

## 1. Purpose

The Research Workspace is the core learning environment in Curio.

Its job is to help a user move from curiosity into a completed learning session by guiding them through focused research, note capture, reflection, AI feedback, and archival into their personal library.

The MVP should optimize for active learning, clarity, and completion — not maximal note-taking power.

---

## 2. MVP Goal

A user should be able to complete one meaningful learning session without leaving the workspace.

A completed MVP session includes:

- A selected topic and challenge
- A focus timer session
- Written notes
- At least one source
- A short reflection
- AI-generated feedback
- A saved library entry

---

## 3. MVP Scope

### Included

#### Session Context

- Topic title
- Topic category
- Challenge prompt
- Difficulty
- Estimated duration
- Session status: draft, active, reflecting, completed

#### Focus Timer

- Start timer
- Pause timer
- Resume timer
- Finish early
- Basic progress indicator
- Default duration options: 25 and 50 minutes

#### Notes Editor

- Rich text writing area
- Basic formatting: headings, bold, italic, bullets, numbered lists, quotes, links
- Autosave
- Last saved status
- Empty state prompt

#### Sources

- Add source URL
- Add source title
- Add optional source note
- Display source list
- Require at least one source before completion

#### Key Claims

A simplified replacement for the full Evidence Collector.

Each key claim includes:

- Claim text
- Optional linked source
- Confidence level: low, medium, high

This keeps the active learning value without making the MVP feel like academic software.

#### Reflection

Required before session completion.

Prompts:

- What did you learn?
- What surprised you?
- What remains unclear?
- Confidence before
- Confidence after

#### AI Review

Generated after reflection submission.

AI feedback should include:

- Session summary
- Strengths in the user's understanding
- Possible gaps or weak spots
- 2–3 follow-up questions
- 2–3 suggested related topics

AI should coach and challenge, not replace thinking.

#### Library Save

After completion, the session should immediately appear in the user's library.

Saved library entry includes:

- Topic
- Challenge
- Notes
- Sources
- Key claims
- Reflection
- AI feedback
- Duration
- Completion date

---

## 4. Deferred From MVP One

The following should not be included in the first build unless explicitly re-scoped:

- Voice notes
- Video recording
- Image uploads inside notes
- Tables in editor
- Math blocks
- Code blocks beyond simple plain text formatting
- Full evidence database workflow
- PDF annotation
- Browser extension clipper
- Whiteboard mode
- Mind-map canvas
- Offline mode
- Live collaboration
- Source credibility scoring
- Automatic citation formatting

These are valuable, but they add meaningful product, technical, and UX complexity.

---

## 5. Recommended UX Structure

The MVP workspace should be mode-based instead of showing every tool at once.

### Primary Modes

#### Research Mode

Default workspace state.

Purpose:

- Focus on writing notes
- Add sources
- Capture key claims
- Use timer

Visible areas:

- Header with topic, challenge, and timer
- Main notes editor
- Collapsible left drawer for sources and key claims
- Collapsible right drawer for AI coach and checklist
- Sticky bottom action for finishing the session

#### Reflect Mode

Triggered when the user selects Finish Session.

Purpose:

- Slow the user down before saving
- Capture learning outcome
- Make completion feel intentional

Visible areas:

- Reflection form
- Session checklist
- Notes and sources summary
- Submit for AI Review button

#### Review Mode

Triggered after reflection submission.

Purpose:

- Show AI feedback
- Let the user decide what to do next

Visible areas:

- AI summary
- Feedback and knowledge gaps
- Follow-up questions
- Suggested related topics
- Save to Library confirmation
- Actions: Go to Library, Spin Again

---

## 6. Layout Recommendation

### Desktop

- Header: topic, challenge, timer, progress
- Main area: large notes editor
- Left drawer: sources and key claims
- Right drawer: checklist and AI coach
- Footer/sticky action: Save status and Finish Session

### Mobile

- Single-column layout
- Notes editor first
- Sources, key claims, and AI coach as bottom sheets or tabs
- Timer pinned near top
- Finish Session sticky at bottom

Mobile should not attempt to show sidebars.

---

## 7. Key UX Principles

### Reduce Cognitive Load

The user should always know what to do next.

Use a simple checklist:

- Start timer
- Add notes
- Add one source
- Reflect
- Review AI feedback
- Save session

### Make Autosave Visible

Autosave should feel trustworthy.

States:

- Saving...
- Saved
- Offline / unable to save
- Retry save

### Encourage, Do Not Block Too Early

The workspace should allow messy thinking during research.

Completion can require reflection and one source, but writing should remain flexible while the session is active.

### Keep AI Supportive But Secondary

AI should be a coach in the side drawer, not the center of the workspace.

The user's thinking should remain the primary artifact.

### Design For Completion

The MVP should make finishing feel satisfying.

Completion state should show:

- Session saved
- Time focused
- Topic added to library
- Suggested next topic

---

## 8. Empty States

### Notes Empty

Start with one insight, question, or thing you want to understand.

### Sources Empty

Add the first article, video, paper, or page you used.

### Key Claims Empty

Capture one claim you believe is important.

### AI Coach Idle

When you're ready, I can summarize, question, or challenge your understanding.

---

## 9. Error States

### Autosave Failed

Message:

Your latest changes have not saved yet. Keep writing — Curio will retry automatically.

Actions:

- Retry now
- Copy notes

### AI Unavailable

Message:

AI feedback is unavailable right now. Your session can still be saved.

Actions:

- Save without AI
- Try AI review again

### Upload/Source Save Failed

Message:

That item did not save. Check your connection and try again.

Actions:

- Retry
- Dismiss

### Timer Interrupted

Message:

Your timer paused unexpectedly. Your notes are safe.

Actions:

- Resume
- Finish early

---

## 10. Accessibility Requirements

- Keyboard navigable editor controls
- Keyboard navigable drawers/modals
- Visible focus states
- Screen-reader labels for timer controls
- WCAG AA contrast minimum
- Adjustable readable text size
- No motion-only feedback
- Respect reduced motion settings

---

## 11. Analytics For MVP

Track only events that help improve the learning loop.

Events:

- Session started
- Timer started
- Timer completed
- Session finished early
- Source added
- Key claim added
- Reflection submitted
- AI review requested
- AI review completed
- Session completed
- Session abandoned

Derived metrics:

- Completion rate
- Average session duration
- Average sources per session
- Reflection completion rate
- AI review usage rate

---

## 12. Data Model Draft

### research_sessions

- id
- user_id
- topic_id
- challenge_id
- status
- duration_minutes
- started_at
- completed_at
- created_at
- updated_at

### notes

- id
- session_id
- content_json
- content_text
- created_at
- updated_at

### sources

- id
- session_id
- title
- url
- note
- created_at

### key_claims

- id
- session_id
- claim
- source_id
- confidence_level
- created_at

### reflections

- id
- session_id
- learned
- surprised
- unclear
- confidence_before
- confidence_after
- created_at

### ai_feedback

- id
- session_id
- summary
- strengths
- gaps
- follow_up_questions
- suggested_topics
- created_at

---

## 13. API / Server Action Draft

The app can use Next.js Server Actions or API routes. For MVP, Server Actions are likely enough unless external clients need API access.

Required actions:

- startSession
- updateSession
- autosaveNotes
- addSource
- updateSource
- deleteSource
- addKeyClaim
- updateKeyClaim
- deleteKeyClaim
- submitReflection
- generateAiReview
- completeSession

---

## 14. Acceptance Criteria

- User can enter the workspace from a selected topic.
- User can start, pause, resume, and finish a timer.
- User can write notes in a rich text editor.
- Notes autosave and show save status.
- User can add at least one source.
- User can add optional key claims.
- User cannot complete a session without required reflection fields.
- User cannot complete a session without at least one source.
- User can request AI review after reflection.
- User can save even if AI review fails.
- Completed session appears in the library immediately.
- Workspace is usable on desktop and mobile.

---

## 15. Open Product Questions

- Should users be allowed to complete a session with notes only and no source for non-research topics?
- Should AI review run automatically after reflection, or only when requested?
- Should the timer be required, or can users skip it?
- Should confidence before be captured before the session starts instead of during reflection?
- Should key claims be mandatory or optional?

---

## 16. MVP Build Recommendation

Build this feature in four slices:

### Slice 1: Static Workspace UX

- Layout
- Modes
- Editor shell
- Source drawer
- Checklist
- Timer UI

### Slice 2: Persistence

- Session creation
- Notes autosave
- Sources
- Key claims
- Reflection
- Completion flow

### Slice 3: AI Review

- AI review prompt
- Feedback generation
- Failure handling
- Suggested topics

### Slice 4: Library Integration

- Saved session card
- Topic detail page
- Search indexing basics
- Completed session redirect

This keeps the MVP shippable while preserving the larger Curio vision.
