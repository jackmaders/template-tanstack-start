import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import type { PostCreate } from "./posts.schema";

const LIST_POSTS_LIMIT = 50;

export async function listPosts(db = getDb()) {
	return await db
		.select()
		.from(posts)
		.orderBy(desc(posts.id))
		.limit(LIST_POSTS_LIMIT);
}

export async function createPost(values: PostCreate, db = getDb()) {
	const [post] = await db.insert(posts).values(values).returning();

	if (!post) {
		throw new Error("The post could not be created.");
	}

	return post;
}

export async function deletePost(id: number, db = getDb()) {
	return await db.delete(posts).where(eq(posts.id, id)).returning();
}
