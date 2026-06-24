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
import type { RequestLogger } from "evlog";
import { useRequest } from "nitro/context";

function getRequestLog(): RequestLogger | undefined {
  try {
    return useRequest().context?.log as RequestLogger | undefined;
  } catch {
    return undefined;
  }
}

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
    const log = getRequestLog();
    const userId = await requireUserId();

    log?.set({ sync: { operation: "pull", since: data.since } });

    const result = await remotePullEvents(userId, data.since);

    log?.set({
      sync: {
        operation: "pull",
        since: data.since,
        returned: result.events.length,
        hasMore: result.hasMore,
        cursor: result.cursor,
      },
    });

    return result;
  });

export const pushSyncEvents = createServerFn({ method: "POST" })
  .validator(pushSyncEventsInputSchema)
  .handler(async ({ data }): Promise<SyncPushResponse> => {
    const log = getRequestLog();
    const userId = await requireUserId();

    log?.set({
      sync: {
        operation: "push",
        incomingCount: data.events.length,
        collectionIds: [...new Set(data.events.map((event) => event.collectionId))],
      },
    });

    const confirmed = await remotePushEvents(userId, data.events);

    log?.set({
      sync: {
        operation: "push",
        incomingCount: data.events.length,
        confirmedCount: confirmed.length,
      },
    });

    return { confirmed };
  });
