import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
	createRouter as createTanStackRouter,
	type ErrorComponentProps,
	Link,
} from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { dispatchError } from "./lib/dispatch-error";
import { ApplicationError, UnexpectedServerError } from "./lib/errors";
import { createQueryClient } from "./lib/query-client";
import { reportError } from "./lib/report-error";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = createQueryClient();

	const router = createTanStackRouter({
		context: { queryClient },
		defaultErrorComponent: RouteErrorPage,
		defaultOnCatch: (error) => {
			if (
				!(
					error instanceof ApplicationError ||
					error instanceof UnexpectedServerError
				)
			) {
				reportError(error, "Route rendering failed");
			}
		},
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
	useEffect(() => dispatchError(error, () => true), [error]);
	const resetErrors = useCallback(() => {
		queryErrorResetBoundary.reset();
		reset();
	}, [queryErrorResetBoundary, reset]);

	return (
		<main>
			<h1>Something went wrong</h1>
			<p>
				{error instanceof ApplicationError
					? error.message
					: "We couldn't load this page."}
			</p>
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
