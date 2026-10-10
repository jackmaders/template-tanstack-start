import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import type { PostInsert } from "./posts.schema";

export async function getPosts(db = getDb()) {
	return await db.select().from(posts).orderBy(desc(posts.id)).limit(50);
}

export async function addPost(values: PostInsert, db = getDb()) {
	const [post] = await db.insert(posts).values(values).returning();

	if (!post) {
		throw new Error("The post could not be created.");
	}

	return post;
}

export async function removePost(id: number, db = getDb()) {
	return await db.delete(posts).where(eq(posts.id, id)).returning();
}
