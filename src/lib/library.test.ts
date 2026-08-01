import { describe, expect, it } from "vitest";

import { matchesLibraryFilters } from "@/lib/library";

describe("library filtering", () => {
  const session = {
    notes: "Chlorophyll captures light energy during photosynthesis.",
    topicCategory: "Science",
    topicTitle: "How plants convert light into energy"
  };

  it("matches topic, category, and note text case-insensitively", () => {
    expect(
      matchesLibraryFilters({
        ...session,
        query: "PLANTS",
        selectedCategory: ""
      })
    ).toBe(true);
    expect(
      matchesLibraryFilters({
        ...session,
        query: "chlorophyll",
        selectedCategory: "science"
      })
    ).toBe(true);
  });

  it("rejects unrelated searches and categories", () => {
    expect(
      matchesLibraryFilters({ ...session, query: "jazz", selectedCategory: "" })
    ).toBe(false);
    expect(
      matchesLibraryFilters({ ...session, query: "", selectedCategory: "Art" })
    ).toBe(false);
  });
});
