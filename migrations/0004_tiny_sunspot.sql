CREATE TABLE `weapon` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`atk` integer,
	`crt` integer
);
--> statement-breakpoint
CREATE TABLE `weapon_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`weapon_id` integer NOT NULL,
	`base_url` text,
	`max_url` text,
	FOREIGN KEY (`weapon_id`) REFERENCES `weapon`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `weapon_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`weapon_id` integer NOT NULL,
	`skill_name` text NOT NULL,
	`skill_description` text NOT NULL,
	FOREIGN KEY (`weapon_id`) REFERENCES `weapon`(`id`) ON UPDATE no action ON DELETE no action
);
