import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import type { z } from "zod";
import { posts } from "@/db/schema/posts";

export const createPostSchema = createInsertSchema(posts, {
	title: (schema) => schema.trim().min(1),
}).omit({ id: true });
export const selectPostSchema = createSelectSchema(posts);
export const deletePostSchema = selectPostSchema.pick({ id: true });

export type Post = typeof posts.$inferSelect;
export type PostCreate = z.infer<typeof createPostSchema>;
export type PostDelete = z.infer<typeof deletePostSchema>;
