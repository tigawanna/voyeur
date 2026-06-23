import type { OutboundEvent, PullResponse, PushResponse } from "event-sourced-collection";
import { pullSyncEvents, pushSyncEvents } from "#/lib/sync.functions";
import { toSyncEventPayload } from "#/types/sync";

export async function pushEvents(events: ReadonlyArray<OutboundEvent>): Promise<PushResponse> {
  if (events.length === 0) {
    return { confirmed: [] };
  }

  return pushSyncEvents({
    data: {
      events: events.map((event) => ({
        ...event,
        payload: toSyncEventPayload(event.payload),
      })),
    },
  });
}

export async function pullEvents({ since }: { since: number }): Promise<PullResponse> {
  return pullSyncEvents({ data: { since } }) as Promise<PullResponse>;
}
