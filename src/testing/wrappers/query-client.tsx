import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { PropsWithChildren, ReactNode } from "react";
import { onTestFinished } from "vitest";
import { createQueryClient } from "@/lib/query-client";

export function createQueryTestContext() {
	const queryClient = createQueryClient();
	queryClient.setDefaultOptions({
		mutations: { retry: false },
		queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
	});
	onTestFinished(() => queryClient.clear());

	function wrapper({ children }: PropsWithChildren) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	}

	return { queryClient, wrapper };
}

export function renderWithQuery(ui: ReactNode) {
	const { wrapper } = createQueryTestContext();
	return render(ui, { wrapper });
}
