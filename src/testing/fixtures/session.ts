import type { User } from "better-auth";

export const TEST_USER = { id: "user-1" } as User;

export const TEST_SESSION = {
	session: {
		createdAt: new Date("2026-10-14T00:00:00Z"),
		expiresAt: new Date("2026-10-15T00:00:00Z"),
		id: "session-1",
		token: "test-session-token",
		updatedAt: new Date("2026-10-14T00:00:00Z"),
		userId: TEST_USER.id,
	},
	user: TEST_USER,
};
