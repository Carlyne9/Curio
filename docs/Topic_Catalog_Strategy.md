# Curio Topic Catalog Strategy

## Current MVP Source

Curio uses an internal, product-curated starter catalog rather than a live external topic feed.

The source file is `src/data/topic-seeds.json`. It currently contains:

- 6 fields
- 12 topics per field
- 72 topics total
- One difficulty label per topic
- One focused research challenge per topic

The seed script copies this catalog into the Supabase `topics` and `challenges` tables.

## Why Curated First

A reviewed catalog gives the MVP:

- Predictable topic quality
- Balanced category coverage
- Topics scoped for 10–60 minute sessions
- No dependency on another service during onboarding
- No surprise cost, unsafe output, or duplicate-topic problem

The topic prompt is a starting point, not an evidence source. Users still collect and save their
own research sources inside the workspace.

## Editorial Standard

Each starter topic should be:

- Framed as an open, curiosity-led question
- Understandable without specialist knowledge
- Researchable using multiple credible sources
- Narrow enough for one focused session
- Broad enough to support follow-up questions
- Free of a predetermined conclusion
- Paired with a practical learning challenge

## Future Expansion

After MVP validation, OpenAI can generate candidate topics based on the user’s interests and
learning history. Generated candidates should be deduplicated, safety-checked, and reviewed before
joining the permanent catalog.

Useful future topic fields include:

- `review_status`
- `reviewed_at`
- `source_notes`
- `interest_tags`
- `prerequisite_topic_ids`
- `generated_by`
- `times_selected`
- `completion_rate`
