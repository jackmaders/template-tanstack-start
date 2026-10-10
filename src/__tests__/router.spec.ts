import { toast } from "@/components/ui/toast-manager";
import { getRouter } from "../router";

vi.mock("@/components/ui/toast-manager");
vi.mock("@/db/db.server.ts");

test("creates the application router with its navigation defaults", () => {
	const router = getRouter();

	expect(router.options.scrollRestoration).toBe(true);
	expect(router.options.defaultPreload).toBe("intent");
	expect(router.options.defaultPreloadStaleTime).toBe(0);
	expect(router.routeTree).toBeDefined();
});

test("shows a high priority toast when a mutation fails", async () => {
	const router = getRouter();
	const error = new Error("mutation failed");
	const queryClient = router.options.context.queryClient;
	const mutation = queryClient.getMutationCache().build(queryClient, {
		mutationFn: async () => {
			throw error;
		},
	});

	await expect(mutation.execute(undefined)).rejects.toBe(error);

	expect(toast.add).toHaveBeenCalledWith({
		description: "mutation failed",
		priority: "high",
		type: "error",
	});
});
