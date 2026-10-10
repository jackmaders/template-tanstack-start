import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { postKeys } from "@/features/posts/api/posts.queries";
import type { Post, PostDelete } from "@/features/posts/api/posts.schema";
import { deletePost } from "@/features/posts/api/posts.server";
import { useDeletePost } from "@/features/posts/api/use-delete-post";

vi.mock("@tanstack/react-query");
vi.mock("@/features/posts/api/posts.server");
vi.mock("@tanstack/react-start");

function getMutationOptions() {
	renderHook(() => useDeletePost());
	const options = vi.mocked(useMutation).mock.lastCall?.[0];
	if (!options) throw new Error("useDeletePost did not configure a mutation");
	return options as UseMutationOptions<Post[], Error, PostDelete>;
}

function getMutationFn(options: UseMutationOptions<Post[], Error, PostDelete>) {
	if (!options.mutationFn) throw new Error("Mutation function is missing");
	return options.mutationFn;
}

test("useDeletePost passes the post id to the server function", async () => {
	const post: Post = { id: 1, title: "Deleted post" };
	const input: PostDelete = { id: post.id };
	vi.mocked(deletePost).mockResolvedValueOnce([post]);
	const options = getMutationOptions();

	await expect(getMutationFn(options)(input, {} as never)).resolves.toEqual([
		post,
	]);
	expect(deletePost).toHaveBeenCalledWith(post.id);
});

test("useDeletePost invalidates posts after success", async () => {
	const options = getMutationOptions();
	const queryClient = vi.mocked(useQueryClient).mock.results[0]?.value;
	if (!queryClient) throw new Error("Query client mock was not used");
	const onSuccess = options.onSuccess;
	if (!onSuccess) throw new Error("Success handler is missing");

	await onSuccess(
		[{ id: 1, title: "Deleted post" }],
		{ id: 1 },
		undefined,
		{} as never,
	);

	expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
		queryKey: postKeys.all,
	});
});

test("useDeletePost propagates server function errors", async () => {
	const error = new Error("Could not delete a post");
	vi.mocked(deletePost).mockRejectedValueOnce(error);
	const options = getMutationOptions();

	await expect(getMutationFn(options)({ id: 1 }, {} as never)).rejects.toBe(
		error,
	);
});
