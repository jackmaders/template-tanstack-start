import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/db.server";
import { posts } from "@/db/schema/posts";
import {
	createPost,
	deletePost,
	listPosts,
	updatePost,
} from "@/features/posts/api/posts-db-queries";
import { createPostFixture } from "@/testing/fixtures/post";
import { TEST_USER } from "@/testing/fixtures/session";

vi.mock("@/db/db.server.ts");

const db = getDb();

it("lists posts by descending id with the configured limit", async () => {
	// Arrange
	const expectedPosts = [
		createPostFixture({ id: 2, title: "Newer post", userId: "user-1" }),
	];

	const select = db.select();
	const from = select.from(posts);
	const query = from.where(eq(posts.userId, "user-1")).orderBy(desc(posts.id));
	vi.mocked(query.limit).mockResolvedValueOnce(expectedPosts);
	vi.clearAllMocks();

	// Act
	const result = await listPosts(TEST_USER);

	// Assert
	expect(result).toBe(expectedPosts);

	expect(db.select).toHaveBeenCalledOnce();
	expect(from.where).toHaveBeenCalledWith(eq(posts.userId, "user-1"));
	expect(select.from).toHaveBeenCalledWith(posts);
	expect(from.where(eq(posts.userId, "user-1")).orderBy).toHaveBeenCalledWith(
		desc(posts.id),
	);
	expect(query.limit).toHaveBeenCalledWith(50);
});

it("creates and returns the inserted post", async () => {
	// Arrange
	const values = { title: "A new post" };
	const post = createPostFixture(values);

	const query = db.insert(posts).values({ ...values, userId: TEST_USER.id });
	vi.mocked(query.returning).mockResolvedValueOnce([post]);
	vi.clearAllMocks();

	// Act
	const result = await createPost(TEST_USER, values);

	// Assert
	expect(result).toBe(post);

	expect(db.insert).toHaveBeenCalledWith(posts);
	expect(query.values).toHaveBeenCalledWith({ ...values, userId: "user-1" });
	expect(query.returning).toHaveBeenCalledOnce();
});

it("throws when creating a post returns no row", async () => {
	// Arrange
	const query = db
		.insert(posts)
		.values({ title: "A new post", userId: TEST_USER.id });
	vi.mocked(query.returning).mockResolvedValueOnce([]);
	vi.clearAllMocks();

	// Act
	const result = createPost(TEST_USER, { title: "A new post" });

	// Assert
	await expect(result).rejects.toThrow("The post could not be created.");
});

it("deletes and returns rows matching the post id", async () => {
	// Arrange
	const id = 7;
	const deletedPost = createPostFixture({ id, title: "Old post" });
	const deletion = db.delete(posts);
	const query = deletion.where(
		and(eq(posts.id, id), eq(posts.userId, TEST_USER.id)),
	);
	vi.mocked(query.returning).mockResolvedValueOnce([deletedPost]);
	vi.clearAllMocks();

	// Act
	const result = await deletePost(TEST_USER, id);

	// Assert
	expect(result).toBe(deletedPost);

	expect(db.delete).toHaveBeenCalledWith(posts);
	expect(deletion.where).toHaveBeenCalledWith(
		and(eq(posts.id, id), eq(posts.userId, TEST_USER.id)),
	);
	expect(query.returning).toHaveBeenCalledOnce();
});

it("throws when the post is not owned by the user", async () => {
	// Arrange
	const query = db
		.delete(posts)
		.where(and(eq(posts.id, 7), eq(posts.userId, TEST_USER.id)));
	vi.mocked(query.returning).mockResolvedValueOnce([]);
	vi.clearAllMocks();

	// Act
	const result = deletePost(TEST_USER, 7);

	// Assert
	await expect(result).rejects.toThrow("Post not found or unauthorized.");
});

it("updates and returns only a post owned by the user", async () => {
	// Arrange
	const values = { id: 7, title: "Updated post" };
	const post = createPostFixture(values);
	const update = db.update(posts);
	const changes = update.set({ title: values.title });
	const query = changes.where(
		and(eq(posts.id, values.id), eq(posts.userId, TEST_USER.id)),
	);
	vi.mocked(query.returning).mockResolvedValueOnce([post]);
	vi.clearAllMocks();

	// Act
	const result = await updatePost(TEST_USER, values);

	// Assert
	expect(result).toBe(post);
	expect(update.set).toHaveBeenCalledWith({ title: "Updated post" });
	expect(changes.where).toHaveBeenCalledWith(
		and(eq(posts.id, 7), eq(posts.userId, TEST_USER.id)),
	);
});

it("rejects updating a missing post or another user's post", async () => {
	// Arrange
	vi.mocked(
		db.update(posts).set({ title: "Updated" }).where(eq(posts.id, 7)).returning,
	).mockResolvedValueOnce([]);

	// Act
	const result = updatePost(TEST_USER, { id: 7, title: "Updated" });

	// Assert
	await expect(result).rejects.toThrow("Post not found or unauthorized.");
});
