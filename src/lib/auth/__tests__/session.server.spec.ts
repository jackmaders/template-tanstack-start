import { it } from "vitest";
import { auth } from "@/lib/auth/auth.server";
import { ensureSession } from "@/lib/auth/session.server";
import { TEST_SESSION } from "@/testing/fixtures/session";

vi.mock("@tanstack/react-start/server");
vi.mock("@/lib/auth/auth.server");

it("returns the authenticated session to protected operations", async () => {
	// Arrange
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(TEST_SESSION);

	// Act
	const session = await ensureSession();

	// Assert
	expect(session).toBe(TEST_SESSION);
});

it("rejects an anonymous protected operation", async () => {
	// Arrange
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

	// Act
	const result = ensureSession();

	// Assert
	await expect(result).rejects.toThrow("Unauthorized");
});
