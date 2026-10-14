import type { z } from "zod";
import { signIn, signOut, signUp } from "@/lib/auth/auth-client";
import { toAuthError } from "@/lib/auth/auth-errors";
import type { loginSchema, signupSchema } from "./account-schema";

export async function signInWithEmail(values: z.infer<typeof loginSchema>) {
	const { data, error } = await signIn.email(values);
	if (error) {
		throw toAuthError(error, "signIn");
	}

	return data;
}

export async function signUpWithEmail(values: z.infer<typeof signupSchema>) {
	const { data, error } = await signUp.email(values);
	if (error) {
		throw toAuthError(error, "signUp");
	}

	return data;
}

export async function signOutUser() {
	const { data, error } = await signOut();
	if (error) {
		throw error;
	}

	return data;
}
