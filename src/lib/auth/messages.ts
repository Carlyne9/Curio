type AuthFailure = {
  code?: string;
};

export const signUpConfirmationMessage =
  "Check your inbox for a confirmation email. If you already have a Curio account, log in instead.";

export function getLoginErrorMessage(error: AuthFailure) {
  if (error.code === "email_not_confirmed") {
    return "Confirm your email before logging in. Check your inbox for Curio’s confirmation email.";
  }

  if (error.code === "invalid_credentials") {
    return "We couldn’t find a matching account. Check your email and password, or create a new account.";
  }

  return "We could not log you in. Check your details and try again.";
}

export function getSignUpErrorMessage(error: AuthFailure) {
  if (error.code === "email_exists" || error.code === "user_already_exists") {
    return "An account with this email already exists. Log in instead.";
  }

  if (error.code === "weak_password") {
    return "Choose a stronger password and try again.";
  }

  return "We could not create your account. Check your details and try again.";
}

export function getGoogleAuthErrorMessage(error: AuthFailure) {
  if (
    error.code === "provider_disabled" ||
    error.code === "oauth_provider_not_supported"
  ) {
    return "Google sign-in is not available yet. Use email and password for now.";
  }

  return "Google sign-in could not be started. Please try again.";
}
