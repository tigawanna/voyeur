export function isAuthBypassEnabled() {
  return (
    import.meta.env.VITE_BYPASS_AUTH === "true" ||
    process.env.VITE_BYPASS_AUTH === "true" ||
    process.env.E2E === "true"
  );
}
