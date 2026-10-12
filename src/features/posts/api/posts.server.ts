import type { User } from "better-auth";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import type { PostCreate } from "./posts-schema";

const LIST_POSTS_LIMIT = 50;

export async function listPosts(user: User, db = getDb()) {
	return await db
		.select()
		.from(posts)
		.where(eq(posts.userId, user.id))
		.orderBy(desc(posts.id))
		.limit(LIST_POSTS_LIMIT);
}

export async function createPost(user: User, values: PostCreate, db = getDb()) {
	const [post] = await db
		.insert(posts)
		.values({ ...values, userId: user.id })
		.returning();

	if (!post) {
		throw new Error("The post could not be created.");
	}

	return post;
}

export async function deletePost(user: User, id: number, db = getDb()) {
	const [deleted] = await db
		.delete(posts)
		.where(and(eq(posts.id, id), eq(posts.userId, user.id)))
		.returning();

	if (!deleted) {
		throw new Error("Post not found or unauthorized.");
	}

	return deleted;
}
