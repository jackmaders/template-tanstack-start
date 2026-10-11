import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/features/posts/api/posts.server";
import { useDeletePost } from "@/features/posts/api/use-delete-post";

vi.mock("@tanstack/react-query");
vi.mock("@tanstack/react-start");
vi.mock("@/features/posts/api/posts.server");

test("forwards the post id and returns the deleted posts", async () => {
	const data = { id: 1 };
	const posts = [{ id: 1, title: "Deleted post" }];
	vi.mocked(deletePost).mockResolvedValueOnce(posts);

	const { mutateAsync } = useDeletePost();

	await expect(mutateAsync(data)).resolves.toBe(posts);

	expect(useMutation).toHaveBeenCalledOnce();
	expect(deletePost).toHaveBeenCalledOnce();
	expect(deletePost).toHaveBeenCalledWith(data.id);
});

test("invalidates post queries after a successful mutation", async () => {
	const { invalidateQueries } = useQueryClient();
	const { mutateAsync } = useDeletePost();

	await mutateAsync({ id: 1 });

	expect(invalidateQueries).toHaveBeenCalledOnce();
	expect(invalidateQueries).toHaveBeenCalledWith({
		queryKey: ["posts"],
	});
});

test("propagates errors from deleting a post", async () => {
	const error = new Error("Unable to delete post");
	vi.mocked(deletePost).mockRejectedValueOnce(error);
	const { mutateAsync } = useDeletePost();

	await expect(mutateAsync({ id: 1 })).rejects.toBe(error);
});
