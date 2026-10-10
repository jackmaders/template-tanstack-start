import { createPostFn, deletePostFn, listPostsFn } from "../posts.functions";
import { createPost, deletePost, listPosts } from "../posts.server";

vi.mock("@tanstack/react-start");
vi.mock("../posts.server");

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
		"../posts.schema"
	);
	await import("../posts.functions");

	const builder = vi.mocked(createServerFn).mock.results[0]?.value;

	expect(builder?.validator).toHaveBeenNthCalledWith(1, createPostSchema);
	expect(builder?.validator).toHaveBeenNthCalledWith(2, deletePostSchema);
});
