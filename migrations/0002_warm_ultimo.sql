CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stigmata_id` integer NOT NULL,
	`position` text NOT NULL,
	`icon_url` text,
	`big_url` text,
	FOREIGN KEY (`stigmata_id`) REFERENCES `stigmata`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stigmata_id` integer NOT NULL,
	`position` text NOT NULL,
	`name` text NOT NULL,
	`skill_name` text,
	`skill_description` text,
	FOREIGN KEY (`stigmata_id`) REFERENCES `stigmata`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `set_effects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stigmata_id` integer NOT NULL,
	`set_name` text,
	`two_piece_name` text,
	`two_piece_effect` text,
	`three_piece_name` text,
	`three_piece_effect` text,
	FOREIGN KEY (`stigmata_id`) REFERENCES `stigmata`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_id` integer NOT NULL,
	`hp` integer,
	`atk` integer,
	`def` integer,
	`crt` integer,
	`sp` integer,
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `stigmata` DROP COLUMN `img`;--> statement-breakpoint
ALTER TABLE `stigmata` DROP COLUMN `pos`;--> statement-breakpoint
ALTER TABLE `stigmata` DROP COLUMN `eff`;--> statement-breakpoint
ALTER TABLE `stigmata` DROP COLUMN `p2`;--> statement-breakpoint
ALTER TABLE `stigmata` DROP COLUMN `p3`;