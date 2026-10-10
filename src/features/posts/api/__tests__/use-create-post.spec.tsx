import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { postKeys } from "@/features/posts/api/posts.queries";
import type { Post } from "@/features/posts/api/posts.schema";
import { createPost } from "@/features/posts/api/posts.server";
import { useCreatePost } from "@/features/posts/api/use-create-post";

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

test("useCreatePost starts idle and reports a pending mutation", async () => {
	const queryClient = createQueryClient();
	const post: Post = { id: 1, title: "Created post" };
	let resolveCreatePost: (value: Post) => void = () => {};
	vi.mocked(createPost).mockReturnValueOnce(
		new Promise((resolve) => {
			resolveCreatePost = resolve;
		}),
	);
	const { result } = renderHook(() => useCreatePost(), {
		wrapper: createWrapper(queryClient),
	});

	expect(result.current.status).toBe("idle");

	let mutation: Promise<Post>;
	act(() => {
		mutation = result.current.mutateAsync({ title: "Created post" });
	});
	await waitFor(() => expect(result.current.isPending).toBe(true));

	await act(async () => {
		resolveCreatePost(post);
		await mutation;
	});

	await waitFor(() => expect(result.current.status).toBe("success"));
});

test("useCreatePost sends the post data and invalidates the posts query on success", async () => {
	const queryClient = createQueryClient();
	const post: Post = { id: 2, title: "New post" };
	queryClient.setQueryData(postKeys.all, [{ id: 1, title: "Existing post" }]);
	vi.mocked(createPost).mockResolvedValueOnce(post);
	const { result } = renderHook(() => useCreatePost(), {
		wrapper: createWrapper(queryClient),
	});

	await act(async () => {
		await expect(
			result.current.mutateAsync({ title: "New post" }),
		).resolves.toEqual(post);
	});

	expect(createPost).toHaveBeenCalledWith({ title: "New post" });
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(true);
	await waitFor(() => expect(result.current.status).toBe("success"));
});

test("useCreatePost reports a failed mutation without invalidating posts", async () => {
	const queryClient = createQueryClient();
	const error = new Error("Could not create post");
	queryClient.setQueryData(postKeys.all, [{ id: 1, title: "Existing post" }]);
	vi.mocked(createPost).mockRejectedValueOnce(error);
	const { result } = renderHook(() => useCreatePost(), {
		wrapper: createWrapper(queryClient),
	});

	await act(async () => {
		await expect(
			result.current.mutateAsync({ title: "Failed post" }),
		).rejects.toBe(error);
	});

	await waitFor(() => expect(result.current.status).toBe("error"));
	expect(result.current.error).toBe(error);
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(false);
});
