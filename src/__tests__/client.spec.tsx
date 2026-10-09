import { isValidElement, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { vi } from "vitest";

vi.mock("@tanstack/react-start/client");
vi.mock("react-dom/client");

test("hydrates the application inside React strict mode", async () => {
	await import("../client");

	expect(hydrateRoot).toHaveBeenCalledOnce();

	const [root, app] = vi.mocked(hydrateRoot).mock.calls[0] ?? [];
	expect(root).toBe(document);
	expect(isValidElement(app)).toBe(true);

	if (!isValidElement(app)) {
		throw new Error("The client must hydrate a React element");
	}

	expect(app.type).toBe(StrictMode);
});
