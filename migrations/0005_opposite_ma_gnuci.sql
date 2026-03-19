CREATE TABLE `astralop_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`astralop_id` integer NOT NULL,
	`category` text NOT NULL,
	`skill_order` integer NOT NULL,
	`skill_name` text NOT NULL,
	`skill_description` text NOT NULL,
	`unlock` text NOT NULL,
	`img_url` text,
	FOREIGN KEY (`astralop_id`) REFERENCES `astralop`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `astralop_specializations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`astralop_id` integer NOT NULL,
	`sp_name` text NOT NULL,
	`sp_tag` text NOT NULL,
	FOREIGN KEY (`astralop_id`) REFERENCES `astralop`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `astralop` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`img_url` text,
	`damage` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `stigmata_images` ADD `img_url` text;--> statement-breakpoint
ALTER TABLE `stigmata_images` DROP COLUMN `icon_url`;--> statement-breakpoint
ALTER TABLE `stigmata_images` DROP COLUMN `big_url`;