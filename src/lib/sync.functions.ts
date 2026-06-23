import { remotePullEvents, remotePushEvents } from "#/data-access-layer/sync/remote";
import { getAuth } from "#/lib/auth";
import {
  pullSyncEventsInputSchema,
  pushSyncEventsInputSchema,
  type SyncPullResponse,
  type SyncPushResponse,
} from "#/types/sync";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

async function requireUserId(): Promise<string> {
  const session = await getAuth().api.getSession({ headers: getRequestHeaders() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export const pullSyncEvents = createServerFn({ method: "GET" })
  .validator(pullSyncEventsInputSchema)
  .handler(async ({ data }): Promise<SyncPullResponse> => {
    const userId = await requireUserId();
    return remotePullEvents(userId, data.since);
  });

export const pushSyncEvents = createServerFn({ method: "POST" })
  .validator(pushSyncEventsInputSchema)
  .handler(async ({ data }): Promise<SyncPushResponse> => {
    const userId = await requireUserId();
    const confirmed = await remotePushEvents(userId, data.events);
    return { confirmed };
  });
