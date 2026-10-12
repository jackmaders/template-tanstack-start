import { act, renderHook, waitFor } from "@testing-library/react";
import { deletePost } from "@/features/posts/api/posts.server";
import { postKeys } from "@/features/posts/api/posts-queries";
import type { Post } from "@/features/posts/api/posts-schema";
import { useDeletePost } from "@/features/posts/api/use-delete-post";
import { createTestPromise } from "@/testing/test-promise";
import { createQueryTestContext } from "@/testing/wrappers/query-client";

vi.mock("@tanstack/react-start");
vi.mock("@/lib/auth/auth.functions");
vi.mock("@/features/posts/api/posts.server");

test("forwards mutation data and exposes the successful result", async () => {
	// Arrange
	const data = { id: 1 };
	const expected = [{ id: 1, title: "Deleted post" }];
	vi.mocked(deletePost).mockResolvedValueOnce(expected);
	const { wrapper } = createQueryTestContext();
	const { result } = renderHook(() => useDeletePost(), { wrapper });

	// Act
	let returned: typeof expected | undefined;
	await act(async () => {
		returned = await result.current.mutateAsync(data);
	});

	// Assert
	expect(returned).toBe(expected);
	expect(deletePost).toHaveBeenCalledExactlyOnceWith(data.id);
	await waitFor(() => expect(result.current.isSuccess).toBe(true));
	expect(result.current.data).toBe(expected);
});

test("invalidates cached post queries after a successful mutation", async () => {
	// Arrange
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryData(postKeys.all, []);
	queryClient.setQueryData(["unrelated"], "keep");
	vi.mocked(deletePost).mockResolvedValueOnce([
		{ id: 1, title: "Deleted post" },
	]);
	const { result } = renderHook(() => useDeletePost(), { wrapper });

	// Act
	await act(async () => {
		await result.current.mutateAsync({ id: 1 });
	});

	// Assert
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(true);
	expect(queryClient.getQueryState(["unrelated"])?.isInvalidated).toBe(false);
});

test("exposes mutation errors without invalidating cached posts", async () => {
	// Arrange
	const error = new Error("Mutation failed");
	vi.mocked(deletePost).mockRejectedValueOnce(error);
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryData(postKeys.all, []);
	const { result } = renderHook(() => useDeletePost(), { wrapper });

	// Act
	await act(async () => {
		await expect(result.current.mutateAsync({ id: 1 })).rejects.toBe(error);
	});

	// Assert
	await waitFor(() => expect(result.current.isError).toBe(true));
	expect(result.current.error).toBe(error);
	expect(deletePost).toHaveBeenCalledOnce();
	expect(queryClient.getQueryState(postKeys.all)?.isInvalidated).toBe(false);
});

test("stays pending while the server operation is unresolved", async () => {
	// Arrange

	const { promise } = createTestPromise<Post[]>([
		{ id: 1, title: "Deleted post" },
	]);
	vi.mocked(deletePost).mockReturnValueOnce(promise);
	const { wrapper } = createQueryTestContext();
	const { result } = renderHook(() => useDeletePost(), { wrapper });

	// Act
	act(() => result.current.mutate({ id: 1 }));

	// Assert
	await waitFor(() => expect(result.current.isPending).toBe(true));
});

test("exposes success after a pending server operation completes", async () => {
	// Arrange
	const { promise, resolve } = createTestPromise<Post[]>([
		{ id: 1, title: "Deleted post" },
	]);
	vi.mocked(deletePost).mockReturnValueOnce(promise);
	const { wrapper } = createQueryTestContext();
	const { result } = renderHook(() => useDeletePost(), { wrapper });

	// Act
	act(() => result.current.mutate({ id: 1 }));
	await resolve([{ id: 1, title: "Deleted post" }]);

	// Assert
	await waitFor(() => expect(result.current.isSuccess).toBe(true));
	expect(result.current.isPending).toBe(false);
});
