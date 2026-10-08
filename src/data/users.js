// Hardcoded demo accounts. No backend — this is the "user database".
// Kept in one place so Cypress fixtures can mirror it exactly.

export const USERS = [
  {
    id: 1,
    email: "user@test.com",
    password: "Test@123",
    name: "Asha Rao",
    role: "customer",
  },
  {
    id: 2,
    email: "admin@test.com",
    password: "Admin@456",
    name: "Dev Kamath",
    role: "admin",
  },
  {
    id: 3,
    email: "blocked@test.com",
    password: "Block@789",
    name: "Sam Pinto",
    role: "customer",
    disabled: true, // exists, correct password, still cannot sign in
  },
];

export function findUserByEmail(email) {
  const needle = String(email || "").trim().toLowerCase();
  return USERS.find((u) => u.email.toLowerCase() === needle) || null;
}
