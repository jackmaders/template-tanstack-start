import { vi } from "vitest";
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

vi.mock("@/features/posts/api/posts.server");
vi.mock("@tanstack/react-start");

test("listPostsFn delegates to listPosts and returns its posts", async () => {
	const posts = [{ id: 2, title: "A post" }];
	vi.mocked(listPosts).mockResolvedValueOnce(posts);

	await expect(listPostsFn()).resolves.toEqual(posts);
	expect(listPosts).toHaveBeenCalledOnce();
});

test("createPostFn validates and delegates the post data", async () => {
	const post = { id: 3, title: "First post" };
	vi.mocked(createPost).mockResolvedValueOnce(post);

	await expect(
		createPostFn({ data: { title: "  First post  " } }),
	).resolves.toEqual(post);
	expect(createPost).toHaveBeenCalledWith({ title: "First post" });
});

test("createPostFn rejects a blank title before creating a post", async () => {
	await expect(createPostFn({ data: { title: "   " } })).rejects.toThrow();
	expect(createPost).not.toHaveBeenCalled();
});

test("deletePostFn delegates the validated post id and returns deleted posts", async () => {
	const deletedPosts = [{ id: 4, title: "Old post" }];
	vi.mocked(deletePost).mockResolvedValueOnce(deletedPosts);

	await expect(deletePostFn({ data: { id: 4 } })).resolves.toEqual(
		deletedPosts,
	);
	expect(deletePost).toHaveBeenCalledWith(4);
});

test("deletePostFn rejects a non-integer id before deleting a post", async () => {
	await expect(deletePostFn({ data: { id: 1.5 } })).rejects.toThrow();
	expect(deletePost).not.toHaveBeenCalled();
});
