import { createAuthClient } from "better-auth/react";
import { signIn, signOut, signUp, useSession } from "@/lib/auth/auth-client";

vi.mock("better-auth/react");

it("exports authentication methods and the session hook from the same client", () => {
	// Act
	const client = createAuthClient();

	// Assert
	expect(signIn).toBe(client.signIn);
	expect(signUp).toBe(client.signUp);
	expect(signOut).toBe(client.signOut);
	expect(useSession).toBe(client.useSession);
});
