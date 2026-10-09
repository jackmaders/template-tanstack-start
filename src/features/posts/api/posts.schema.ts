import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { posts } from "@/db/schema/posts";

export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);
export const deletePostSchema = selectPostSchema.pick({ id: true });
