import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import {
	createPost,
	deletePost,
	listPosts,
} from "@/features/posts/api/posts.server";
import { createPostFixture } from "@/testing/fixtures/post";

vi.mock("@/db/db.server.ts");

const db = getDb();

test("lists posts by descending id with the configured limit", async () => {
	// Arrange
	const expectedPosts = [createPostFixture({ id: 2, title: "Newer post" })];

	const select = db.select();
	const from = select.from(posts);
	const query = from.orderBy(desc(posts.id));
	vi.mocked(query.limit).mockResolvedValueOnce(expectedPosts);
	vi.clearAllMocks();

	// Act
	const result = await listPosts();

	// Assert
	expect(result).toBe(expectedPosts);

	expect(db.select).toHaveBeenCalledOnce();
	expect(select.from).toHaveBeenCalledWith(posts);
	expect(from.orderBy).toHaveBeenCalledWith(desc(posts.id));
	expect(query.limit).toHaveBeenCalledWith(50);
});

test("creates and returns the inserted post", async () => {
	// Arrange
	const values = { title: "A new post" };
	const post = createPostFixture(values);

	const query = db.insert(posts).values(values);
	vi.mocked(query.returning).mockResolvedValueOnce([post]);
	vi.clearAllMocks();

	// Act
	const result = await createPost(values);

	// Assert
	expect(result).toBe(post);

	expect(db.insert).toHaveBeenCalledWith(posts);
	expect(query.values).toHaveBeenCalledWith(values);
	expect(query.returning).toHaveBeenCalledOnce();
});

test("throws when creating a post returns no row", async () => {
	// Arrange
	const query = db.insert(posts).values({ title: "A new post" });
	vi.mocked(query.returning).mockResolvedValueOnce([]);
	vi.clearAllMocks();

	// Act
	const result = createPost({ title: "A new post" });

	// Assert
	await expect(result).rejects.toThrow("The post could not be created.");
});

test("deletes and returns rows matching the post id", async () => {
	// Arrange
	const id = 7;
	const deletedPosts = [createPostFixture({ id, title: "Old post" })];
	const deletion = db.delete(posts);
	const query = deletion.where(eq(posts.id, id));
	vi.mocked(query.returning).mockResolvedValueOnce(deletedPosts);
	vi.clearAllMocks();

	// Act
	const result = await deletePost(id);

	// Assert
	expect(result).toBe(deletedPosts);

	expect(db.delete).toHaveBeenCalledWith(posts);
	expect(deletion.where).toHaveBeenCalledWith(eq(posts.id, id));
	expect(query.returning).toHaveBeenCalledOnce();
});
