import type { Page } from "@playwright/test";
import { resolveTmdbMockResponse } from "../mock/tmdb-responses";

export async function installTmdbMocks(page: Page) {
  await page.route("**/api/tmdb/**", async (route) => {
    const resolved = resolveTmdbMockResponse(route.request().url(), route.request().method());
    if (resolved == null) {
      await route.continue();
      return;
    }

    if (resolved.body == null) {
      await route.fulfill({ status: resolved.status, body: "" });
      return;
    }

    await route.fulfill({
      status: resolved.status,
      contentType: "application/json",
      body: JSON.stringify(resolved.body),
    });
  });
}
