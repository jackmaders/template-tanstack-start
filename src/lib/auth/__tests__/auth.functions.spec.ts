import { getRequestHeaders } from "@tanstack/react-start/server";
import { ensureSession, getSession } from "@/lib/auth/auth.functions";
import { auth } from "@/lib/auth/auth.server";

vi.mock("@tanstack/react-start");
vi.mock("@tanstack/react-start/server");
vi.mock("@/lib/auth/auth.server");

test("getSession returns the session using request headers", async () => {
	// Arrange
	const headers = new Headers({ cookie: "session=token" });
	const timestamp = new Date("2026-01-01T00:00:00Z");
	const session = {
		session: {
			createdAt: timestamp,
			expiresAt: timestamp,
			id: "session-1",
			token: "token",
			updatedAt: timestamp,
			userId: "user-1",
		},
		user: {
			createdAt: timestamp,
			email: "person@example.com",
			emailVerified: true,
			id: "user-1",
			name: "Person",
			updatedAt: timestamp,
		},
	};
	vi.mocked(getRequestHeaders).mockReturnValueOnce(headers);
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(session);
	// Act
	const result = await getSession();
	// Assert
	expect(result).toBe(session);
	expect(auth.api.getSession).toHaveBeenCalledExactlyOnceWith({ headers });
});

test("ensureSession returns the session using request headers", async () => {
	// Arrange
	const headers = new Headers({ cookie: "session=token" });
	const timestamp = new Date("2026-01-01T00:00:00Z");
	const session = {
		session: {
			createdAt: timestamp,
			expiresAt: timestamp,
			id: "session-1",
			token: "token",
			updatedAt: timestamp,
			userId: "user-1",
		},
		user: {
			createdAt: timestamp,
			email: "person@example.com",
			emailVerified: true,
			id: "user-1",
			name: "Person",
			updatedAt: timestamp,
		},
	};
	vi.mocked(getRequestHeaders).mockReturnValueOnce(headers);
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(session);
	// Act
	const result = await ensureSession();
	// Assert
	expect(result).toBe(session);
	expect(auth.api.getSession).toHaveBeenCalledExactlyOnceWith({ headers });
});

test("returns null for an anonymous session", async () => {
	// Arrange
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);
	// Act
	const result = await getSession();
	// Assert
	expect(result).toBeNull();
});

test("rejects anonymous requests that require a session", async () => {
	// Arrange
	vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);
	// Act
	const result = ensureSession();
	// Assert
	await expect(result).rejects.toThrow("Unauthorized");
});

test("getSession propagates session lookup failures", async () => {
	// Arrange
	const error = new Error("Session lookup failed");
	vi.mocked(auth.api.getSession).mockRejectedValueOnce(error);
	// Act
	const result = getSession();
	// Assert
	await expect(result).rejects.toBe(error);
});

test("ensureSession propagates session lookup failures", async () => {
	// Arrange
	const error = new Error("Session lookup failed");
	vi.mocked(auth.api.getSession).mockRejectedValueOnce(error);
	// Act
	const result = ensureSession();
	// Assert
	await expect(result).rejects.toBe(error);
});
