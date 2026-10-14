import { toast } from "@/components/ui/toast-manager";
import { getRouter } from "@/router";

vi.mock("@/components/ui/toast-manager");
vi.mock("@/db/db.server.ts");
vi.mock("@/lib/auth/auth.server.ts");
vi.mock("@tanstack/react-router-ssr-query");

test("creates the application router with its navigation defaults", () => {
	// Act
	const router = getRouter();

	// Assert
	expect(router.options.scrollRestoration).toBe(true);
	expect(router.options.defaultPreload).toBe("intent");
	expect(router.options.defaultPreloadStaleTime).toBe(0);
	expect(router.routeTree).toBeDefined();
});

test("shows a high priority toast when a mutation fails", async () => {
	// Arrange
	const error = new Error("mutation failed");

	// Act
	const router = getRouter();
	const { queryClient } = router.options.context;
	const mutation = queryClient.getMutationCache().build(queryClient, {
		mutationFn: () => Promise.reject(error),
	});

	const result = mutation.execute(undefined);

	// Assert
	await expect(result).rejects.toBe(error);

	expect(toast.add).toHaveBeenCalledWith({
		description: "Something went wrong. Please try again.",
		priority: "high",
		type: "error",
	});
});
