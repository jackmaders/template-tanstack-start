import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { type Post, type PostInsert, posts } from "@/db/schema/posts";

export async function getPosts(db = getDb()): Promise<Post[]> {
	return await db.select().from(posts).orderBy(desc(posts.id)).limit(50);
}

export async function addPost(values: PostInsert, db = getDb()): Promise<Post> {
	const [post] = await db.insert(posts).values(values).returning();

	if (!post) {
		throw new Error("The post could not be created.");
	}

	return post;
}

export async function removePost(id: number, db = getDb()): Promise<void> {
	await db.delete(posts).where(eq(posts.id, id));
}
