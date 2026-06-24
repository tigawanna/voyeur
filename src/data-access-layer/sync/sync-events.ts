import type { ManualSyncResult, SyncResult } from "event-sourced-collection";
import { ensureDb } from "#/data-access-layer/tmdb/local-library-db";
import { AppConfig } from "#/utils/system";

function readLibrarySyncPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(AppConfig.librarySyncStorageKey) === "true";
}

export async function applyLibrarySyncPreference(): Promise<boolean> {
  const database = await ensureDb();
  const enabled = readLibrarySyncPreference();
  database.setSyncEnabled(enabled);
  return enabled;
}

export async function setLibrarySyncEnabled(enabled: boolean): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(AppConfig.librarySyncStorageKey, enabled ? "true" : "false");
  }

  const database = await ensureDb();
  database.setSyncEnabled(enabled);

  if (enabled) {
    await database.sync();
  }
}

export function isLibrarySyncEnabled(): boolean {
  return readLibrarySyncPreference();
}

export async function syncLibraryEvents(): Promise<SyncResult> {
  const database = await ensureDb();
  return database.sync();
}

export async function manualSyncLibraryEvents(): Promise<ManualSyncResult> {
  const database = await ensureDb();
  return database.manualSync();
}
