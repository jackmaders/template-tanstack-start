import {
	createPostFn,
	deletePostFn,
	listPostsFn,
} from "@/features/posts/api/posts.functions";
import {
	createPost,
	deletePost,
	listPosts,
} from "@/features/posts/api/posts-db-queries";
import { ensureSession } from "@/lib/auth/session.server";
import { createPostFixture } from "@/testing/fixtures/post";
import { TEST_USER } from "@/testing/fixtures/session";

vi.mock("@/lib/auth/session.server");
vi.mock("@tanstack/react-start");
vi.mock("@/features/posts/api/posts-db-queries");

test("lists posts and returns the server result", async () => {
	// Arrange
	const posts = [createPostFixture()];
	vi.mocked(listPosts).mockResolvedValueOnce(posts);

	// Act
	const result = await listPostsFn();

	// Assert
	expect(result).toBe(posts);
	expect(listPosts).toHaveBeenCalledExactlyOnceWith(TEST_USER);
});

test("validates and forwards new post data", async () => {
	// Arrange
	const data = { title: "test" };

	// Act
	await createPostFn({ data });

	// Assert
	expect(createPost).toHaveBeenCalledWith(TEST_USER, data);
});

test("validates and forwards delete request", async () => {
	// Arrange
	const id = 1;

	// Act
	await deletePostFn({ data: { id } });

	// Assert
	expect(deletePost).toHaveBeenCalledWith(TEST_USER, id);
});

test("trims the title before creating a post", async () => {
	// Arrange
	const data = { title: "  A post  " };

	// Act
	await createPostFn({ data });

	// Assert
	expect(createPost).toHaveBeenCalledWith(TEST_USER, { title: "A post" });
});

test("rejects an empty title before writing", async () => {
	// Arrange
	const data = { title: "   " };

	// Act
	const result = createPostFn({ data });

	// Assert
	await expect(result).rejects.toThrow();
	expect(createPost).not.toHaveBeenCalled();
});

test("rejects an invalid post id before deleting", async () => {
	// Arrange
	const data = { id: Number.NaN };

	// Act
	const result = deletePostFn({ data });

	// Assert
	await expect(result).rejects.toThrow();
	expect(deletePost).not.toHaveBeenCalled();
});

test("rejects anonymous post creation before writing", async () => {
	// Arrange
	vi.mocked(ensureSession).mockRejectedValueOnce(new Error("Unauthorized"));

	// Act
	const result = createPostFn({ data: { title: "Blocked" } });

	// Assert
	await expect(result).rejects.toThrow("Unauthorized");
	expect(createPost).not.toHaveBeenCalled();
});

test("rejects anonymous post deletion before writing", async () => {
	// Arrange
	vi.mocked(ensureSession).mockRejectedValueOnce(new Error("Unauthorized"));

	// Act
	const result = deletePostFn({ data: { id: 1 } });

	// Assert
	await expect(result).rejects.toThrow("Unauthorized");
	expect(deletePost).not.toHaveBeenCalled();
});
