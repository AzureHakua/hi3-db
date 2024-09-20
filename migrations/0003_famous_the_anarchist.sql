PRAGMA foreign_keys = OFF;
--> statement-breakpoint
-- Rename tables
ALTER TABLE `stats` RENAME TO `stigmata_stats`;--> statement-breakpoint
ALTER TABLE `set_effects` RENAME TO `stigmata_set_effects`;--> statement-breakpoint
ALTER TABLE `positions` RENAME TO `stigmata_positions`;--> statement-breakpoint
ALTER TABLE `images` RENAME TO `stigmata_images`;--> statement-breakpoint

PRAGMA foreign_keys = ON;--> statement-breakpoint

-- Verify foreign keys are properly set
PRAGMA foreign_key_check;