ALTER TABLE `posts` ADD `user_id` text REFERENCES user(id) ON DELETE CASCADE;--> statement-breakpoint
CREATE INDEX `posts_user_id_idx` ON `posts` (`user_id`);