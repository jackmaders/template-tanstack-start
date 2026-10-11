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
	const posts = [{ id: 1, title: "A post" }];
	vi.mocked(listPosts).mockResolvedValue(posts);

	await expect(listPostsFn()).resolves.toBe(posts);
	expect(listPosts).toHaveBeenCalledOnce();
});

test("validates and forwards new post data", () => {
	const data = { title: "test" };

	createPostFn({ data });
	expect(createPost).toHaveBeenCalledWith(data);
});

test("validates and forwards delete request", () => {
	const id = 1;

	deletePostFn({ data: { id } });
	expect(deletePost).toHaveBeenCalledWith(id);
});

test("registers the correct schemas", async () => {
	vi.resetModules();

	const { createServerFn } = await import("@tanstack/react-start");
	const { createPostSchema, deletePostSchema } = await import(
		"@/features/posts/api/posts.schema"
	);
	await import("@/features/posts/api/posts.functions");

	const builder = vi.mocked(createServerFn).mock.results[0]?.value;

	expect(builder?.validator).toHaveBeenNthCalledWith(1, createPostSchema);
	expect(builder?.validator).toHaveBeenNthCalledWith(2, deletePostSchema);
});
