import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { onTestFinished } from "vitest";

export function createQueryTestContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: { retry: false },
			queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
		},
	});
	onTestFinished(() => queryClient.clear());

	function wrapper({ children }: PropsWithChildren) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	}

	return { queryClient, wrapper };
}
