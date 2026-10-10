import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const POST_TITLE_MAX_LENGTH = 160;

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title", { length: POST_TITLE_MAX_LENGTH }).notNull(),
});
