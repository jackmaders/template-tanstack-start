import { isValidElement, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

vi.mock("@tanstack/react-start/client");
vi.mock("react-dom/client");

it("hydrates the application inside React strict mode", async () => {
	// Act
	await import("@/client");

	const [root, app] = vi.mocked(hydrateRoot).mock.calls[0] ?? [];
	const appType = isValidElement(app) ? app.type : undefined;

	// Assert
	expect(hydrateRoot).toHaveBeenCalledOnce();
	expect(root).toBe(document);
	expect(isValidElement(app)).toBe(true);

	expect(appType).toBe(StrictMode);
});
