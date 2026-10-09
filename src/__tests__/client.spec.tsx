import { isValidElement, StrictMode } from "react";
import { vi } from "vitest";

import "../__mocks__/client";

test("hydrates the application inside React strict mode", async () => {
	await import("../client");
	const { hydrateRoot } = await import("react-dom/client");

	expect(hydrateRoot).toHaveBeenCalledOnce();

	const [root, app] = vi.mocked(hydrateRoot).mock.calls[0] ?? [];
	expect(root).toBe(document);
	expect(isValidElement(app)).toBe(true);

	if (!isValidElement(app)) {
		throw new Error("The client must hydrate a React element");
	}

	expect(app.type).toBe(StrictMode);
});
