import { and, asc, eq, gt } from "drizzle-orm";
import type { OutboundEvent, PushConfirmation } from "event-sourced-collection";
import { createDb } from "#/lib/drizzle/db";
import { syncEvents } from "#/lib/drizzle/schema/sync-schema";
import { getWorkerEnv } from "#/lib/worker-env";
import { isLibraryCollectionId, toSyncEventPayload, type SyncPullResponse } from "#/types/sync";

const PULL_LIMIT = 500;

function getAppDb() {
  return createDb(getWorkerEnv().DB);
}

export async function remotePushEvents(
  userId: string,
  events: ReadonlyArray<OutboundEvent>,
): Promise<PushConfirmation[]> {
  if (events.length === 0) {
    return [];
  }

  const db = getAppDb();
  const confirmed: PushConfirmation[] = [];

  for (const event of events) {
    if (!isLibraryCollectionId(event.collectionId)) {
      throw new Error(`Unsupported collection: ${event.collectionId}`);
    }

    const existing = await db
      .select({ globalSeq: syncEvents.globalSeq })
      .from(syncEvents)
      .where(and(eq(syncEvents.userId, userId), eq(syncEvents.eventId, event.eventId)))
      .limit(1);

    if (existing.length > 0) {
      confirmed.push({
        eventId: event.eventId,
        globalSeq: existing[0]!.globalSeq,
      });
      continue;
    }

    const inserted = await db
      .insert(syncEvents)
      .values({
        userId,
        eventId: event.eventId,
        collectionId: event.collectionId,
        type: event.type,
        key: String(event.key),
        payload: JSON.stringify(event.payload),
        clientTimestamp: event.timestamp,
      })
      .returning({ globalSeq: syncEvents.globalSeq });

    confirmed.push({
      eventId: event.eventId,
      globalSeq: inserted[0]!.globalSeq,
    });
  }

  return confirmed;
}

export async function remotePullEvents(userId: string, since: number): Promise<SyncPullResponse> {
  const db = getAppDb();

  const rows = await db
    .select()
    .from(syncEvents)
    .where(and(eq(syncEvents.userId, userId), gt(syncEvents.globalSeq, since)))
    .orderBy(asc(syncEvents.globalSeq))
    .limit(PULL_LIMIT);

  const events = rows.map((row) => ({
    globalSeq: row.globalSeq,
    eventId: row.eventId,
    collectionId: row.collectionId,
    type: row.type as SyncPullResponse["events"][number]["type"],
    key: row.key,
    payload: toSyncEventPayload(JSON.parse(row.payload) as Record<string, unknown>),
    timestamp: row.clientTimestamp,
    cursor: String(row.globalSeq),
  }));

  const cursor = events.length > 0 ? events[events.length - 1]!.cursor : String(since);

  return {
    events,
    cursor,
    hasMore: events.length === PULL_LIMIT,
  };
}
