import { deletePost } from "../__mocks__/posts.server";
import { createPostFn, deletePostFn, listPostsFn } from "../posts.functions";
import { createPost, listPosts } from "../posts.server";

vi.mock("@tanstack/react-start");
vi.mock("../posts.server");

test("lists posts and returns the server result", async () => {
	const posts = [{ id: 1, title: "A post" }];
	vi.mocked(listPosts).mockResolvedValue(posts);

	await expect(listPostsFn()).resolves.toBe(posts);
	expect(listPosts).toHaveBeenCalledOnce();
});

test("validates and forwards new post data", async () => {
	const data = { title: "test" };

	createPostFn({ data });
	expect(createPost).toHaveBeenCalledWith(data);
});

test("validates and forwards delete request", async () => {
	const id = 1;

	deletePostFn({ data: { id } });
	expect(deletePost).toHaveBeenCalledWith(id);
});
