// Pure functions — each returns an error string, or "" when the field is fine.
// Keeping them pure means they can also be unit-tested outside the browser.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value) {
  const email = String(value || "").trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(value) {
  const password = String(value || "");
  if (!password) return "Enter your password.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  return "";
}

export function validateLoginForm({ email, password }) {
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  const isValid = !errors.email && !errors.password;
  return { errors, isValid };
}
