import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { vi } from "vitest";
import { postKeys } from "@/features/posts/api/posts.queries";
import type { Post } from "@/features/posts/api/posts.schema";
import { deletePost } from "@/features/posts/api/posts.server";
import { useDeletePost } from "@/features/posts/api/use-delete-post";

vi.mock("@/features/posts/api/posts.server");
vi.mock("@tanstack/react-start");

function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			mutations: { retry: false },
		},
	});
}

function createWrapper(queryClient: QueryClient) {
	return function Wrapper({ children }: PropsWithChildren) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};
}

test("useDeletePost starts idle and reports a pending mutation", async () => {
	const queryClient = createQueryClient();
	const post: Post = { id: 1, title: "Deleted post" };
	let resolveDeletePost: (value: Post[]) => void = () => {};
	vi.mocked(deletePost).mockReturnValueOnce(
		new Promise((resolve) => {
			resolveDeletePost = resolve;
		}),
	);
	const { result } = renderHook(() => useDeletePost(), {
		wrapper: createWrapper(queryClient),
	});

	expect(result.current.status).toBe("idle");

	let mutation: Promise<Post[]>;
	act(() => {
		mutation = result.current.mutateAsync({ id: post.id });
	});
	await waitFor(() => expect(result.current.isPending).toBe(true));

	await act(async () => {
		resolveDeletePost([post]);
		await mutation;
	});

	await waitFor(() => expect(result.current.status).toBe("success"));
});

test("useDeletePost deletes the post and invalidates the posts query on success", async () => {
	const queryClient = createQueryClient();
	const deletedPost: Post = { id: 2, title: "Deleted post" };
	queryClient.setQueryData(postKeys.all, [deletedPost]);
	vi.mocked(deletePost).mockResolvedValueOnce([deletedPost]);
	const { result } = renderHook(() => useDeletePost(), {
		wrapper: createWrapper(queryClient),
	});

	await act(async () => {
		await expect(
			result.current.mutateAsync({ id: deletedPost.id }),
		).resolves.toEqual([deletedPost]);
	});

	expect(deletePost).toHaveBeenCalledWith(deletedPost.id);
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(true);
	await waitFor(() => expect(result.current.status).toBe("success"));
});

test("useDeletePost reports a failed mutation without invalidating posts", async () => {
	const queryClient = createQueryClient();
	const error = new Error("Could not delete post");
	queryClient.setQueryData(postKeys.all, [{ id: 1, title: "Existing post" }]);
	vi.mocked(deletePost).mockRejectedValueOnce(error);
	const { result } = renderHook(() => useDeletePost(), {
		wrapper: createWrapper(queryClient),
	});

	await act(async () => {
		await expect(result.current.mutateAsync({ id: 1 })).rejects.toBe(error);
	});

	await waitFor(() => expect(result.current.status).toBe("error"));
	expect(result.current.error).toBe(error);
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(false);
});
