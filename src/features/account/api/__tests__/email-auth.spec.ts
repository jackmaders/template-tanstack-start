import { FormSubmissionError } from "@/components/forms/form-submission-error";
import {
	signInWithEmail,
	signUpWithEmail,
} from "@/features/account/api/email-auth";
import { signIn, signUp } from "@/lib/auth/auth-client";

vi.mock("@/lib/auth/auth-client");

test("uses a fallback for an empty sign in error message", async () => {
	// Arrange
	vi.mocked(signIn.email).mockResolvedValueOnce({
		data: null,
		error: { message: "", status: 500, statusText: "Server Error" },
	});
	// Act
	const result = signInWithEmail({
		email: "person@example.com",
		password: "password",
	});
	// Assert
	await expect(result).rejects.toBeInstanceOf(FormSubmissionError);
	await expect(result).rejects.toThrow("Unable to sign in. Please try again.");
});

test("uses a fallback for an empty sign up error message", async () => {
	// Arrange
	vi.mocked(signUp.email).mockResolvedValueOnce({
		data: null,
		error: { message: "", status: 500, statusText: "Server Error" },
	});
	// Act
	const result = signUpWithEmail({
		email: "person@example.com",
		name: "Person",
		password: "password",
	});
	// Assert
	await expect(result).rejects.toBeInstanceOf(FormSubmissionError);
	await expect(result).rejects.toThrow("Unable to sign up. Please try again.");
});

test("reports unrecognized client authentication errors", async () => {
	// Arrange
	const authError = {
		code: "NEW_AUTH_ERROR",
		message: "Provider-specific response",
		status: 422,
		statusText: "Unprocessable Entity",
	};
	const reportError = vi.spyOn(console, "error");
	reportError.mockImplementationOnce(() => undefined);
	vi.mocked(signIn.email).mockResolvedValueOnce({
		data: null,
		error: authError,
	});

	// Act
	const result = signInWithEmail({
		email: "person@example.com",
		password: "password",
	});

	// Assert
	await expect(result).rejects.toThrow("Unable to sign in. Please try again.");
	expect(reportError).toHaveBeenCalledExactlyOnceWith(
		"[Better Auth signIn failed]",
		authError,
	);
});

test("does not report recognized expected authentication errors", async () => {
	// Arrange
	const authError = {
		code: "INVALID_EMAIL_OR_PASSWORD",
		message: "Invalid email or password",
		status: 401,
		statusText: "Unauthorized",
	};
	const reportError = vi.spyOn(console, "error");
	reportError.mockImplementationOnce(() => undefined);
	vi.mocked(signIn.email).mockResolvedValueOnce({
		data: null,
		error: authError,
	});

	// Act
	const result = signInWithEmail({
		email: "person@example.com",
		password: "password",
	});

	// Assert
	await expect(result).rejects.toThrow("The email or password is incorrect.");
	expect(reportError).not.toHaveBeenCalled();
});
