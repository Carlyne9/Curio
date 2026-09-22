import { describe, expect, it } from "vitest";

import {
  notesSchema,
  reflectionSchema,
  sourceSchema
} from "@/lib/validations/workspace";

describe("workspace validation", () => {
  it("rejects invalid source URLs", () => {
    expect(
      sourceSchema.safeParse({ title: "Example", url: "not-a-url" }).success
    ).toBe(false);
  });

  it("requires all reflection answers", () => {
    expect(
      reflectionSchema.safeParse({
        learned: "",
        surprised: "A result",
        unclear: "A question"
      }).success
    ).toBe(false);
  });

  it("allows rich notes up to the workspace limit", () => {
    expect(
      notesSchema.safeParse({
        sessionId: "12672ed6-5460-4e22-b9f2-b62c50cfd593",
        content: "Focused notes",
        contentJson: { type: "doc", content: [] }
      }).success
    ).toBe(true);
  });
});
