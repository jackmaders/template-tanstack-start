import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const POST_NAME_MAX_LENGTH = 160;

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name", { length: POST_NAME_MAX_LENGTH }).notNull(),
});
