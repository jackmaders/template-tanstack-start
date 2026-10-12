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
