export function formatMovieRuntime(minutes?: number): string | null {
  if (!minutes) return null;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatMovieCurrency(amount?: number): string | null {
  if (amount == null || amount <= 0) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMovieLanguageCode(code?: string): string | null {
  if (!code) return null;

  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
    return displayNames.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}
