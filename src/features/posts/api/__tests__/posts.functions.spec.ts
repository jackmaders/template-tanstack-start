import {
	createPostFn,
	deletePostFn,
	listPostsFn,
} from "@/features/posts/api/posts.functions";
import {
	createPost,
	deletePost,
	listPosts,
} from "@/features/posts/api/posts.server";

vi.mock("@tanstack/react-start");
vi.mock("@/features/posts/api/posts.server");

test("lists posts and returns the server result", async () => {
	// Arrange
	const posts = [{ id: 1, title: "A post" }];
	vi.mocked(listPosts).mockResolvedValue(posts);

	// Act
	const result = await listPostsFn();

	// Assert
	expect(result).toBe(posts);
	expect(listPosts).toHaveBeenCalledOnce();
});

test("validates and forwards new post data", () => {
	// Arrange
	const data = { title: "test" };

	// Act
	createPostFn({ data });

	// Assert
	expect(createPost).toHaveBeenCalledWith(data);
});

test("validates and forwards delete request", () => {
	// Arrange
	const id = 1;

	// Act
	deletePostFn({ data: { id } });

	// Assert
	expect(deletePost).toHaveBeenCalledWith(id);
});

test("registers the correct schemas", async () => {
	// Arrange
	vi.resetModules();

	const { createServerFn } = await import("@tanstack/react-start");
	const { createPostSchema, deletePostSchema } = await import(
		"@/features/posts/api/posts.schema"
	);

	// Act
	await import("@/features/posts/api/posts.functions");

	const builder = vi.mocked(createServerFn).mock.results[0]?.value;

	// Assert
	expect(builder?.validator).toHaveBeenNthCalledWith(1, createPostSchema);
	expect(builder?.validator).toHaveBeenNthCalledWith(2, deletePostSchema);
});
