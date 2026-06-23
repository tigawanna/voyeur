CREATE TABLE `sync_events` (
	`global_seq` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`event_id` text NOT NULL,
	`collection_id` text NOT NULL,
	`type` text NOT NULL,
	`key` text NOT NULL,
	`payload` text NOT NULL,
	`client_timestamp` integer NOT NULL,
	`server_timestamp` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sync_events_user_global_seq` ON `sync_events` (`user_id`,`global_seq`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sync_events_user_event_id` ON `sync_events` (`user_id`,`event_id`);