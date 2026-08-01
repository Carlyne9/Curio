import { describe, expect, it } from "vitest";

import {
  getGoogleAuthErrorMessage,
  getLoginErrorMessage,
  getSignUpErrorMessage,
  signUpConfirmationMessage
} from "@/lib/auth/messages";

describe("authentication messages", () => {
  it("keeps unknown email and wrong password in one safe login message", () => {
    expect(getLoginErrorMessage({ code: "invalid_credentials" })).toContain(
      "matching account"
    );
  });

  it("guides an unconfirmed user back to their inbox", () => {
    expect(getLoginErrorMessage({ code: "email_not_confirmed" })).toContain(
      "Confirm your email"
    );
  });

  it("guides explicit duplicate signup errors to login", () => {
    expect(getSignUpErrorMessage({ code: "user_already_exists" })).toContain(
      "Log in instead"
    );
  });

  it("uses a non-enumerating signup confirmation message", () => {
    expect(signUpConfirmationMessage).toContain("If you already have");
  });

  it("explains when the Google provider still needs setup", () => {
    expect(getGoogleAuthErrorMessage({ code: "provider_disabled" })).toContain(
      "not available yet"
    );
  });
});
