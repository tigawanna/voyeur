import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { user } from "#/lib/drizzle/schema/auth-schema";

export const syncEvents = sqliteTable(
  "sync_events",
  {
    globalSeq: integer("global_seq").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    eventId: text("event_id").notNull(),
    collectionId: text("collection_id").notNull(),
    type: text("type").notNull(),
    key: text("key").notNull(),
    payload: text("payload").notNull(),
    clientTimestamp: integer("client_timestamp").notNull(),
    serverTimestamp: integer("server_timestamp")
      .notNull()
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`),
  },
  (table) => [
    index("idx_sync_events_user_global_seq").on(table.userId, table.globalSeq),
    uniqueIndex("idx_sync_events_user_event_id").on(table.userId, table.eventId),
  ],
);
