import type { ManualSyncResult, SyncResult } from "event-sourced-collection";
import { ensureDb } from "#/data-access-layer/tmdb/local-library-db";

export async function syncLibraryEvents(): Promise<SyncResult> {
  const database = await ensureDb();
  return database.sync();
}

export async function manualSyncLibraryEvents(): Promise<ManualSyncResult> {
  const database = await ensureDb();
  return database.manualSync();
}
