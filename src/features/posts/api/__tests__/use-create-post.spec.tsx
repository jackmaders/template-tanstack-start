import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { postKeys } from "@/features/posts/api/posts.queries";
import type { Post, PostCreate } from "@/features/posts/api/posts.schema";
import { createPost } from "@/features/posts/api/posts.server";
import { useCreatePost } from "@/features/posts/api/use-create-post";

vi.mock("@tanstack/react-query");
vi.mock("@/features/posts/api/posts.server");
vi.mock("@tanstack/react-start");

function getMutationOptions() {
	renderHook(() => useCreatePost());
	const options = vi.mocked(useMutation).mock.lastCall?.[0];
	if (!options) throw new Error("useCreatePost did not configure a mutation");
	return options as UseMutationOptions<Post, Error, PostCreate>;
}

function getMutationFn(options: UseMutationOptions<Post, Error, PostCreate>) {
	if (!options.mutationFn) throw new Error("Mutation function is missing");
	return options.mutationFn;
}

test("useCreatePost passes post data to the server function", async () => {
	const post: Post = { id: 1, title: "New post" };
	const input: PostCreate = { title: "New post" };
	vi.mocked(createPost).mockResolvedValueOnce(post);
	const options = getMutationOptions();

	await expect(getMutationFn(options)(input, {} as never)).resolves.toEqual(
		post,
	);
	expect(createPost).toHaveBeenCalledWith(input);
});

test("useCreatePost invalidates posts after success", async () => {
	const options = getMutationOptions();
	const queryClient = vi.mocked(useQueryClient).mock.results[0]?.value;
	if (!queryClient) throw new Error("Query client mock was not used");
	const onSuccess = options.onSuccess;
	if (!onSuccess) throw new Error("Success handler is missing");

	await onSuccess(
		{ id: 1, title: "New post" },
		{ title: "New post" },
		undefined,
		{} as never,
	);

	expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
		queryKey: postKeys.all,
	});
});

test("useCreatePost propagates server function errors", async () => {
	const error = new Error("Could not create a post");
	const input: PostCreate = { title: "Failed post" };
	vi.mocked(createPost).mockRejectedValueOnce(error);
	const options = getMutationOptions();

	await expect(getMutationFn(options)(input, {} as never)).rejects.toBe(error);
});
