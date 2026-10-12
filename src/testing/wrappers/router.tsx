import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import {
	createContext,
	type PropsWithChildren,
	type ReactNode,
	useContext,
} from "react";

const TestContent = createContext<ReactNode>(null);

function TestRoot() {
	return useContext(TestContent);
}

export async function createRouterTestContext(initialLocation = "/") {
	const rootRoute = createRootRoute({
		component: TestRoot,
	});
	const route = createRoute({ getParentRoute: () => rootRoute, path: "$" });
	const router = createRouter({
		history: createMemoryHistory({ initialEntries: [initialLocation] }),
		routeTree: rootRoute.addChildren([route]),
	});
	await router.load();

	function wrapper({ children }: PropsWithChildren) {
		return (
			<TestContent.Provider value={children}>
				<RouterProvider router={router} />
			</TestContent.Provider>
		);
	}

	return { router, wrapper };
}
