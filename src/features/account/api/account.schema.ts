import { z } from "zod";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

export const loginSchema = z.object({
	email: z.email("Enter a valid email address"),
	password: z.string().min(1, "Enter your password"),
});

export const signupSchema = z.object({
	email: z.email("Enter a valid email address"),
	name: z.string().trim().min(1, "Enter your name"),
	password: z
		.string()
		.min(PASSWORD_MIN_LENGTH, "Use at least 8 characters")
		.max(PASSWORD_MAX_LENGTH, "Use at most 128 characters"),
});
