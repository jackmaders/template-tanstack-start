import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import {
	createPost,
	deletePost,
	listPosts,
} from "@/features/posts/api/posts.server";
import { createDatabaseFixture } from "@/testing/fixtures/database";
import { createPostFixture } from "@/testing/fixtures/post";

vi.mock("@/db/db.server.ts");

let db: ReturnType<typeof createDatabaseFixture>;

beforeEach(() => {
	db = createDatabaseFixture();
	vi.mocked(getDb, { deep: true, partial: true }).mockReturnValue(db);
});

test("lists posts by descending id with the configured limit", async () => {
	// Arrange
	const expectedPosts = [createPostFixture({ id: 2, title: "Newer post" })];

	vi.mocked(db.limit).mockReturnValueOnce(expectedPosts);

	// Act
	const result = await listPosts();

	// Assert
	expect(result).toBe(expectedPosts);

	expect(db.select).toHaveBeenCalledOnce();
	expect(db.from).toHaveBeenCalledWith(posts);
	expect(db.orderBy).toHaveBeenCalledWith(desc(posts.id));
	expect(db.limit).toHaveBeenCalledWith(50);
});

test("creates and returns the inserted post", async () => {
	// Arrange
	const values = { title: "A new post" };
	const post = createPostFixture(values);

	vi.mocked(db.returning).mockReturnValueOnce([post]);

	// Act
	const result = await createPost(values);

	// Assert
	expect(result).toBe(post);

	expect(db.insert).toHaveBeenCalledWith(posts);
	expect(db.values).toHaveBeenCalledWith(values);
	expect(db.returning).toHaveBeenCalledOnce();
});

test("throws when creating a post returns no row", async () => {
	// Arrange
	vi.mocked(db.returning).mockReturnValueOnce([]);

	// Act
	const result = createPost({ title: "A new post" });

	// Assert
	await expect(result).rejects.toThrow("The post could not be created.");
});

test("deletes and returns rows matching the post id", async () => {
	// Arrange
	const id = 7;
	const deletedPosts = [createPostFixture({ id, title: "Old post" })];
	vi.mocked(db.returning).mockResolvedValueOnce(deletedPosts);

	// Act
	const result = await deletePost(id);

	// Assert
	expect(result).toBe(deletedPosts);

	expect(db.delete).toHaveBeenCalledWith(posts);
	expect(db.where).toHaveBeenCalledWith(eq(posts.id, id));
	expect(db.returning).toHaveBeenCalledOnce();
});
