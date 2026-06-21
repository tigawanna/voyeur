import type { TViewer } from "#/data-access-layer/auth/viewer";

export const bypassViewer: TViewer = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@voyeur.local",
    emailVerified: true,
    image: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  session: {
    id: "test-session-id",
    userId: "test-user-id",
    expiresAt: new Date("2099-01-01T00:00:00.000Z"),
    token: "test-session-token",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
};

export function isAuthBypassEnabled() {
  return (
    import.meta.env.VITE_BYPASS_AUTH === "true" ||
    process.env.VITE_BYPASS_AUTH === "true" ||
    process.env.E2E === "true"
  );
}
