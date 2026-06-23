import { z } from "zod";

export const syncMutationTypeSchema = z.enum(["insert", "update", "delete"]);

export const syncEventPayloadSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

export const outboundEventSchema = z.object({
  eventId: z.string(),
  collectionId: z.string(),
  type: syncMutationTypeSchema,
  key: z.union([z.string(), z.number()]),
  payload: syncEventPayloadSchema,
  timestamp: z.number(),
});

export const pushSyncEventsInputSchema = z.object({
  events: z.array(outboundEventSchema),
});

export const pullSyncEventsInputSchema = z.object({
  since: z.number().int().nonnegative(),
});

export const LIBRARY_COLLECTION_IDS = ["favorites", "watchlist"] as const;

export type LibraryCollectionId = (typeof LIBRARY_COLLECTION_IDS)[number];

export type SyncEventPayload = z.infer<typeof syncEventPayloadSchema>;

export type SyncServerEvent = {
  globalSeq: number;
  eventId: string;
  collectionId: string;
  type: z.infer<typeof syncMutationTypeSchema>;
  key: string | number;
  payload: SyncEventPayload;
  timestamp: number;
  cursor: string;
};

export type SyncPullResponse = {
  events: SyncServerEvent[];
  cursor: string;
  hasMore: boolean;
};

export type SyncPushResponse = {
  confirmed: Array<{
    eventId: string;
    globalSeq: number;
  }>;
  failed?: Array<{
    eventId: string;
    message: string;
    code?: string;
    retryable?: boolean;
  }>;
};

export function isLibraryCollectionId(value: string): value is LibraryCollectionId {
  return (LIBRARY_COLLECTION_IDS as readonly string[]).includes(value);
}

export function toSyncEventPayload(value: Record<string, unknown>): SyncEventPayload {
  const payload: SyncEventPayload = {};

  for (const [key, entry] of Object.entries(value)) {
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean" ||
      entry === null
    ) {
      payload[key] = entry;
    }
  }

  return payload;
}
