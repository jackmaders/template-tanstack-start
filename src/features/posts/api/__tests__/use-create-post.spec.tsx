import { act, renderHook, waitFor } from "@testing-library/react";
import { createPost } from "@/features/posts/api/posts.server";
import { postKeys } from "@/features/posts/api/posts-queries";
import { useCreatePost } from "@/features/posts/api/use-create-post";
import { createQueryTestContext } from "@/testing/query-client";

vi.mock("@tanstack/react-start");
vi.mock("@/lib/auth/auth.functions");
vi.mock("@/features/posts/api/posts.server");

test("forwards mutation data and exposes the successful result", async () => {
	// Arrange
	const data = { title: "New post" };
	const expected = { id: 1, title: "New post" };
	vi.mocked(createPost).mockResolvedValueOnce(expected);
	const { wrapper } = createQueryTestContext();
	const { result } = renderHook(() => useCreatePost(), { wrapper });

	// Act
	let returned: typeof expected | undefined;
	await act(async () => {
		returned = await result.current.mutateAsync(data);
	});

	// Assert
	expect(returned).toBe(expected);
	expect(createPost).toHaveBeenCalledExactlyOnceWith(data);
	await waitFor(() => expect(result.current.isSuccess).toBe(true));
	expect(result.current.data).toBe(expected);
});

test("invalidates cached post queries after a successful mutation", async () => {
	// Arrange
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryData(postKeys.all, []);
	queryClient.setQueryData(["unrelated"], "keep");
	vi.mocked(createPost).mockResolvedValueOnce({ id: 1, title: "New post" });
	const { result } = renderHook(() => useCreatePost(), { wrapper });

	// Act
	await act(async () => {
		await result.current.mutateAsync({ title: "New post" });
	});

	// Assert
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(true);
	expect(queryClient.getQueryState(["unrelated"])?.isInvalidated).toBe(false);
});

test("exposes mutation errors without invalidating cached posts", async () => {
	// Arrange
	const error = new Error("Mutation failed");
	vi.mocked(createPost).mockRejectedValueOnce(error);
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryData(postKeys.all, []);
	const { result } = renderHook(() => useCreatePost(), { wrapper });

	// Act
	await act(async () => {
		await expect(
			result.current.mutateAsync({ title: "New post" }),
		).rejects.toBe(error);
	});

	// Assert
	await waitFor(() => expect(result.current.isError).toBe(true));
	expect(result.current.error).toBe(error);
	expect(createPost).toHaveBeenCalledOnce();
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(false);
});

test("stays pending until the server operation completes", async () => {
	// Arrange
	let resolve!: (value: Awaited<ReturnType<typeof createPost>>) => void;
	const deferred = new Promise<Awaited<ReturnType<typeof createPost>>>(
		(resolvePromise) => {
			resolve = resolvePromise;
		},
	);
	vi.mocked(createPost).mockReturnValueOnce(deferred);
	const { wrapper } = createQueryTestContext();
	const { result } = renderHook(() => useCreatePost(), { wrapper });

	// Act
	act(() => result.current.mutate({ title: "New post" }));

	// Assert
	await waitFor(() => expect(result.current.isPending).toBe(true));
	await act(async () => {
		resolve({ id: 1, title: "New post" });
		await deferred;
	});
	await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
