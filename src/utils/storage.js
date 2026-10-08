// All localStorage access goes through here so tests have one set of keys to
// seed, assert against, and clear.

export const KEYS = {
  SESSION: "shop.session",
  ATTEMPTS: "shop.loginAttempts",
  CART: "shop.cart",
  ORDERS: "shop.orders",
};

export const MAX_ATTEMPTS = 3;

function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    // Corrupted value — treat as absent rather than crashing the app.
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — ignore */
  }
}

/* ---------- session ---------- */

export function getSession() {
  const session = read(KEYS.SESSION);
  if (!session || !session.email) return null;
  return session;
}

export function saveSession(user) {
  write(KEYS.SESSION, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    loggedInAt: new Date().toISOString(),
  });
}

export function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}

/* ---------- failed login attempts ---------- */

export function getAttempts() {
  const n = read(KEYS.ATTEMPTS, 0);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

export function bumpAttempts() {
  const next = getAttempts() + 1;
  write(KEYS.ATTEMPTS, next);
  return next;
}

export function resetAttempts() {
  localStorage.removeItem(KEYS.ATTEMPTS);
}

export function isLockedOut() {
  return getAttempts() >= MAX_ATTEMPTS;
}
