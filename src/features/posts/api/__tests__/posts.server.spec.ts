import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import { createPost, deletePost, listPosts } from "../posts.server";

vi.mock("@/db/db.server.ts");

// biome-ignore lint/suspicious/noExplicitAny: allow any db methods on the mock
const db = getDb() as any;

test("lists posts by descending id with the configured limit", async () => {
	const result = [{ id: 2, title: "Newer post" }];

	vi.mocked(db.limit).mockReturnValueOnce(result);

	await expect(listPosts()).resolves.toBe(result);

	expect(db.select).toHaveBeenCalledOnce();
	expect(db.from).toHaveBeenCalledWith(posts);
	expect(db.orderBy).toHaveBeenCalledWith(desc(posts.id));
	expect(db.limit).toHaveBeenCalledWith(50);
});

test("creates and returns the inserted post", async () => {
	const values = { title: "A new post" };
	const post = { id: 1, ...values };

	vi.mocked(db.returning).mockReturnValueOnce([post]);

	await expect(createPost(values)).resolves.toBe(post);

	expect(db.insert).toHaveBeenCalledWith(posts);
	expect(db.values).toHaveBeenCalledWith(values);
	expect(db.returning).toHaveBeenCalledOnce();
});

test("throws when creating a post returns no row", async () => {
	vi.mocked(db.returning).mockReturnValueOnce([]);

	await expect(createPost({ title: "A new post" })).rejects.toThrow(
		"The post could not be created.",
	);
});

test("deletes and returns rows matching the post id", async () => {
	const id = 7;
	const deletedPosts = [{ id, title: "Old post" }];
	vi.mocked(db.returning).mockResolvedValueOnce(deletedPosts);

	await expect(deletePost(id)).resolves.toBe(deletedPosts);

	expect(db.delete).toHaveBeenCalledWith(posts);
	expect(db.where).toHaveBeenCalledWith(eq(posts.id, id));
	expect(db.returning).toHaveBeenCalledOnce();
});
