import { act, renderHook } from "@testing-library/react";
import { toast } from "@/components/ui/toast-manager";
import { useSession } from "@/lib/auth/auth-client";
import { useSessionStatus } from "@/lib/auth/use-session-status";

vi.mock("@/components/ui/toast-manager");
vi.mock("@/lib/auth/auth-client");

test("claims duplicate session failures without toasts and preserves cached identity", () => {
	// Arrange
	const cached = useSession();
	const error = {
		error: {},
		message: "private provider details",
		name: "BetterFetchError",
		status: 500,
		statusText: "Server Error",
	};
	vi.mocked(useSession)
		.mockReturnValueOnce({ ...cached, error })
		.mockReturnValueOnce({ ...cached, error });
	const report = vi
		.spyOn(console, "error")
		.mockImplementationOnce(() => undefined);

	// Act
	const first = renderHook(() => useSessionStatus());
	renderHook(() => useSessionStatus());

	// Assert
	expect(first.result.current.data).toBe(cached.data);
	expect(first.result.current.error).toBe(error);
	expect(report).toHaveBeenCalledOnce();
	expect(toast.add).not.toHaveBeenCalled();
});

test("contains retry rejections and keeps their feedback inline", async () => {
	// Arrange
	const cached = useSession();
	const refetch = vi.fn().mockRejectedValueOnce(new Error("network failure"));
	vi.mocked(useSession).mockReturnValueOnce({ ...cached, refetch });
	const { result } = renderHook(() => useSessionStatus());

	// Act
	await act(async () => {
		await expect(result.current.retrySession()).resolves.toBeUndefined();
	});

	// Assert
	expect(refetch).toHaveBeenCalledOnce();
	expect(toast.add).not.toHaveBeenCalled();
});
