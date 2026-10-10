import { getRouter } from "../router";

vi.mock("@/db/db.server.ts");

test("creates the application router with its navigation defaults", () => {
	const router = getRouter();

	expect(router.options.scrollRestoration).toBe(true);
	expect(router.options.defaultPreload).toBe("intent");
	expect(router.options.defaultPreloadStaleTime).toBe(0);
	expect(router.routeTree).toBeDefined();
});
