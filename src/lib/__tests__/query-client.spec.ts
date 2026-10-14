import { useMutation } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "@/components/ui/toast-manager";
import { InvalidCredentialsError } from "@/lib/errors";
import { createQueryTestContext } from "@/testing/wrappers/query-client";

vi.mock("@/components/ui/toast-manager");

test("native onError observes failures without claiming their presentation", async () => {
	// Arrange
	const { wrapper } = createQueryTestContext();
	const error = new InvalidCredentialsError();
	const onError = vi.fn();
	const { result } = renderHook(
		() =>
			useMutation({
				mutationFn: () => Promise.reject(error),
				onError,
			}),
		{ wrapper },
	);

	// Act
	await act(async () => {
		await expect(result.current.mutateAsync()).rejects.toBe(error);
	});

	// Assert
	await waitFor(() => expect(result.current.isError).toBe(true));
	expect(result.current.error).toBe(error);
	expect(onError).toHaveBeenCalledExactlyOnceWith(
		error,
		undefined,
		undefined,
		expect.anything(),
	);
	expect(toast.add).toHaveBeenCalledOnce();
});

test("mutate contains its rejection and dispatches through metadata", async () => {
	// Arrange
	const { wrapper } = createQueryTestContext();
	const error = new InvalidCredentialsError();
	const handleError = vi.fn(() => true);
	const { result } = renderHook(
		() =>
			useMutation({
				meta: { handleError },
				mutationFn: () => Promise.reject(error),
			}),
		{ wrapper },
	);

	// Act
	act(() => {
		result.current.mutate();
	});

	// Assert
	await waitFor(() => expect(result.current.isError).toBe(true));
	expect(handleError).toHaveBeenCalledExactlyOnceWith(error);
	expect(toast.add).not.toHaveBeenCalled();
});

test("waits for query retries to finish before dispatching one failure", async () => {
	// Arrange
	const { queryClient } = createQueryTestContext();
	const error = new Error("query failed");
	const queryFn = vi.fn(() => Promise.reject(error));

	// Act
	const result = queryClient.fetchQuery({
		queryFn,
		queryKey: ["retry"],
		retry: 2,
		retryDelay: () => {
			expect(toast.add).not.toHaveBeenCalled();
			return 0;
		},
	});

	// Assert
	await expect(result).rejects.toBe(error);
	expect(queryFn).toHaveBeenCalledTimes(3);
	expect(toast.add).toHaveBeenCalledOnce();
});

test("retains cached data when a refresh fails and is claimed inline", async () => {
	// Arrange
	const { queryClient } = createQueryTestContext();
	const error = new Error("refresh failed");
	const handleError = vi.fn(() => true);
	queryClient.setQueryData(["cached"], ["last loaded result"]);

	// Act
	const result = queryClient.fetchQuery({
		meta: { handleError },
		queryFn: () => Promise.reject(error),
		queryKey: ["cached"],
	});

	// Assert
	await expect(result).rejects.toBe(error);
	expect(queryClient.getQueryData(["cached"])).toEqual(["last loaded result"]);
	expect(handleError).toHaveBeenCalledExactlyOnceWith(error);
	expect(toast.add).not.toHaveBeenCalled();
});
