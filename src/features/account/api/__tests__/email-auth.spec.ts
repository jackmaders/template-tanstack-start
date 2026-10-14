import {
	signInWithEmail,
	signOutUser,
	signUpWithEmail,
} from "@/features/account/api/email-auth";
import { signIn, signOut, signUp } from "@/lib/auth/auth-client";
import {
	EmailAlreadyRegisteredError,
	InvalidCredentialsError,
} from "@/lib/errors";

vi.mock("@/lib/auth/auth-client");

test("translates invalid credentials into a concrete safe application error", async () => {
	// Arrange
	vi.mocked(signIn.email).mockResolvedValueOnce({
		data: null,
		error: {
			code: "INVALID_EMAIL_OR_PASSWORD",
			message: "vendor details",
			status: 401,
			statusText: "Unauthorized",
		},
	});

	// Act
	const result = signInWithEmail({
		email: "person@example.com",
		password: "password",
	});

	// Assert
	await expect(result).rejects.toBeInstanceOf(InvalidCredentialsError);
	await expect(result).rejects.toThrow("The email or password is incorrect.");
});

test("translates an existing account into a concrete application error", async () => {
	// Arrange
	vi.mocked(signUp.email).mockResolvedValueOnce({
		data: null,
		error: {
			code: "USER_ALREADY_EXISTS",
			message: "vendor details",
			status: 422,
			statusText: "Unprocessable Entity",
		},
	});

	// Act
	const result = signUpWithEmail({
		email: "person@example.com",
		name: "Person",
		password: "password",
	});

	// Assert
	await expect(result).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
});

test("preserves unfamiliar responses for central reporting and fallback", async () => {
	// Arrange
	const error = {
		code: "NEW_AUTH_ERROR",
		message: "provider details",
		status: 500,
		statusText: "Server Error",
	};
	vi.mocked(signIn.email).mockResolvedValueOnce({ data: null, error });

	// Act
	const result = signInWithEmail({
		email: "person@example.com",
		password: "password",
	});

	// Assert
	await expect(result).rejects.toBe(error);
});

test("does not mistake a server failure for invalid credentials", async () => {
	// Arrange
	const error = {
		code: "INVALID_PASSWORD",
		message: "provider details",
		status: 500,
		statusText: "Server Error",
	};
	vi.mocked(signIn.email).mockResolvedValueOnce({ data: null, error });

	// Act
	const result = signInWithEmail({
		email: "person@example.com",
		password: "password",
	});

	// Assert
	await expect(result).rejects.toBe(error);
});

test("preserves rejected authentication requests", async () => {
	// Arrange
	const error = new Error("network details");
	vi.mocked(signUp.email).mockRejectedValueOnce(error);

	// Act
	const result = signUpWithEmail({
		email: "person@example.com",
		name: "Person",
		password: "password",
	});

	// Assert
	await expect(result).rejects.toBe(error);
});

test("preserves failed sign-out responses for central dispatch", async () => {
	// Arrange
	const error = {
		message: "provider details",
		status: 500,
		statusText: "Server Error",
	};
	vi.mocked(signOut).mockResolvedValueOnce({ data: null, error });

	// Act
	const result = signOutUser();

	// Assert
	await expect(result).rejects.toBe(error);
});
