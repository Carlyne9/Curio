-- Confidence before/after is no longer collected in the reflection UI.
-- Relax the NOT NULL constraint so new reflections can omit it; existing
-- rows and their check constraint (1-5 when present) are left untouched
-- so historical data still displays correctly.

alter table public.reflections
  alter column confidence_before drop not null;

alter table public.reflections
  alter column confidence_after drop not null;
