import {
	MutationCache,
	QueryClient,
	useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import {
	createRouter as createTanStackRouter,
	type ErrorComponentProps,
	Link,
} from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "./components/ui/toast-manager";
import { getUserFacingErrorMessage, reportUnexpectedError } from "./lib/errors";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient({
		mutationCache: new MutationCache({
			onError: (error, _variables, _context, mutation) => {
				reportUnexpectedError(error, "Mutation failed");
				if (mutation.meta?.errorPresentation === "form") {
					return;
				}

				toast.add({
					description: getUserFacingErrorMessage(error),
					priority: "high",
					type: "error",
				});
			},
		}),
	});

	const router = createTanStackRouter({
		context: { queryClient },
		defaultErrorComponent: RouteErrorPage,
		defaultOnCatch: (error) =>
			reportUnexpectedError(error, "Route rendering failed"),
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		routeTree,
		scrollRestoration: true,
	});

	setupRouterSsrQueryIntegration({ queryClient, router });

	return router;
}

function RouteErrorPage({ error, reset }: ErrorComponentProps) {
	const queryErrorResetBoundary = useQueryErrorResetBoundary();
	const resetErrors = useCallback(() => {
		queryErrorResetBoundary.reset();
		reset();
	}, [queryErrorResetBoundary, reset]);

	return (
		<main>
			<h1>Something went wrong</h1>
			<p>{getUserFacingErrorMessage(error, "We couldn't load this page.")}</p>
			<div className="flex gap-2">
				<Button onClick={resetErrors} type="button">
					Try again
				</Button>
				<Button render={<Link to="/" />} variant="outline">
					Return home
				</Button>
			</div>
		</main>
	);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
