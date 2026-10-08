import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { findUserByEmail } from "../data/users";
import { validateLoginForm } from "../utils/validation";
import {
  bumpAttempts,
  getAttempts,
  getSession,
  isLockedOut,
  resetAttempts,
  saveSession,
  MAX_ATTEMPTS,
} from "../utils/storage";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(isLockedOut());

  // Where to go after a successful sign in — back to the guarded page if the
  // user was redirected here, otherwise the storefront.
  const redirectTo = location.state?.from || "/products";

  // Already signed in? Don't show the form at all.
  useEffect(() => {
    if (getSession()) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo]);

  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - getAttempts());

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    if (touched[name]) {
      const { errors: next } = validateLoginForm({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: next[name] }));
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const { errors: next } = validateLoginForm(form);
    setErrors((prev) => ({ ...prev, [name]: next[name] }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (locked) return;

    setTouched({ email: true, password: true });
    const { errors: next, isValid } = validateLoginForm(form);
    setErrors(next);
    setFormError("");

    // Field-level problems never count as a failed credential attempt.
    if (!isValid) return;

    setSubmitting(true);

    // Small delay so the pending state is observable and testable.
    setTimeout(() => {
      const user = findUserByEmail(form.email);
      const passwordMatches = user && user.password === form.password;

      if (user && user.disabled && passwordMatches) {
        setSubmitting(false);
        setFormError("This account has been suspended. Contact support.");
        return;
      }

      if (!passwordMatches) {
        const used = bumpAttempts();
        const left = Math.max(0, MAX_ATTEMPTS - used);
        setSubmitting(false);

        if (left === 0) {
          setLocked(true);
          setFormError(
            "Too many failed attempts. This account is locked. Reset to try again."
          );
        } else {
          setFormError(
            `Email or password is incorrect. ${left} attempt${
              left === 1 ? "" : "s"
            } left.`
          );
        }
        return;
      }

      resetAttempts();
      saveSession(user);
      setSubmitting(false);
      navigate(redirectTo, { replace: true });
    }, 300);
  }

  function handleUnlock() {
    resetAttempts();
    setLocked(false);
    setFormError("");
  }

  return (
    <main className="auth" data-cy="login-page">
      <section className="auth__brand" aria-hidden="true">
        <span className="auth__mark">ShopGuard</span>
        <p className="auth__tagline">
          A small shop for testing big ideas.
        </p>
      </section>

      <section className="auth__panel">
        <form className="auth__form" onSubmit={handleSubmit} noValidate data-cy="login-form">
          <h1 className="auth__title">Sign in</h1>
          <p className="auth__sub">Use the demo account to browse the store.</p>

          <div className="field">
            <label className="field__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`field__input ${errors.email ? "field__input--bad" : ""}`}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              autoComplete="username"
              disabled={locked || submitting}
              aria-invalid={Boolean(errors.email)}
              data-cy="email-input"
            />
            {errors.email && (
              <p className="field__error" data-cy="email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">
              Password
            </label>
            <div className="field__wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`field__input ${errors.password ? "field__input--bad" : ""}`}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="At least 8 characters"
                autoComplete="current-password"
                disabled={locked || submitting}
                aria-invalid={Boolean(errors.password)}
                data-cy="password-input"
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                disabled={locked}
                data-cy="password-toggle"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="field__error" data-cy="password-error">
                {errors.password}
              </p>
            )}
          </div>

          {formError && (
            <p className="alert" role="alert" data-cy="form-error">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="btn"
            disabled={locked || submitting}
            data-cy="login-button"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          {locked && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleUnlock}
              data-cy="unlock-button"
            >
              Reset and try again
            </button>
          )}

          <p className="auth__attempts" data-cy="attempts-left">
            {locked ? "Account locked" : `${attemptsLeft} of ${MAX_ATTEMPTS} attempts remaining`}
          </p>

          <div className="hint" data-cy="demo-credentials">
            <span className="hint__k">Demo</span>
            <span data-cy="demo-email">user@test.com</span>
            <span data-cy="demo-password">Test@123</span>
          </div>
        </form>
      </section>
    </main>
  );
}
