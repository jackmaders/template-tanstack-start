import { afterEach, beforeEach, vi } from "vitest";

function blockNetworkRequests() {
	vi.stubGlobal(
		"fetch",
		vi.fn(() => {
			throw new Error(
				"Unexpected network request. Mock this request explicitly.",
			);
		}),
	);
}

blockNetworkRequests();
beforeEach(blockNetworkRequests);

afterEach(() => {
	vi.unstubAllGlobals();
});
