import type { z } from "zod";
import { FormSubmissionError } from "@/components/forms/form-submission-error";
import { signIn, signUp } from "@/lib/auth/auth-client";
import type { loginSchema, signupSchema } from "./account-schema";

export async function signInWithEmail(values: z.infer<typeof loginSchema>) {
	const { data, error } = await signIn.email(values);
	if (error) {
		throw new FormSubmissionError(
			error.message || "Unable to sign in. Please try again.",
		);
	}

	return data;
}

export async function signUpWithEmail(values: z.infer<typeof signupSchema>) {
	const { data, error } = await signUp.email(values);
	if (error) {
		throw new FormSubmissionError(
			error.message || "Unable to sign up. Please try again.",
		);
	}

	return data;
}
