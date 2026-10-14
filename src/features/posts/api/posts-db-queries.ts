import type { User } from "better-auth";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import { PostNotFoundError } from "@/lib/errors";
import type { PostCreate, PostUpdate } from "./posts-schema";

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
		throw new PostNotFoundError();
	}

	return deleted;
}

export async function updatePost(user: User, values: PostUpdate, db = getDb()) {
	const [post] = await db
		.update(posts)
		.set({ title: values.title })
		.where(and(eq(posts.id, values.id), eq(posts.userId, user.id)))
		.returning();
	if (!post) {
		throw new PostNotFoundError();
	}
	return post;
}
