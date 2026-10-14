import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth/auth.server";
import { getSessionFn } from "@/lib/auth/session.functions";
import { TEST_SESSION } from "@/testing/fixtures/session";

vi.mock("@tanstack/react-start");
vi.mock("@tanstack/react-start/server");
vi.mock("@/lib/auth/auth.server");

test("forwards request headers when looking up a session through the server function", async () => {
	// Arrange
	const headers = new Headers({ cookie: "session=test-session" });
	vi.mocked(getRequestHeaders).mockReturnValueOnce(headers);
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(TEST_SESSION);

	// Act
	const session = await getSessionFn();

	// Assert
	expect(session).toEqual(TEST_SESSION);
	expect(auth.api.getSession).toHaveBeenCalledExactlyOnceWith({ headers });
});

test("returns no session to an anonymous route caller", async () => {
	// Arrange
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

	// Act
	const session = await getSessionFn();

	// Assert
	expect(session).toBeNull();
});
