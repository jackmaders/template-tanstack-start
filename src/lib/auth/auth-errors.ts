import {
	EmailAlreadyRegisteredError,
	InvalidCredentialsError,
} from "@/lib/errors";

type AuthAction = "signIn" | "signUp";
const CLIENT_ERROR_STATUS = 400;
const SERVER_ERROR_STATUS = 500;

/** Translate known Better Auth responses; preserve unfamiliar failures for dispatch. */
export function toAuthError(error: unknown, action: AuthAction) {
	if (
		typeof error !== "object" ||
		error === null ||
		!("status" in error) ||
		!("code" in error)
	) {
		return error;
	}
	const { code, status } = error;
	if (
		typeof status !== "number" ||
		status < CLIENT_ERROR_STATUS ||
		status >= SERVER_ERROR_STATUS
	) {
		return error;
	}
	if (
		action === "signIn" &&
		(code === "INVALID_EMAIL_OR_PASSWORD" || code === "INVALID_PASSWORD")
	) {
		return new InvalidCredentialsError();
	}
	if (
		action === "signUp" &&
		(code === "USER_ALREADY_EXISTS" ||
			code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL")
	) {
		return new EmailAlreadyRegisteredError();
	}
	return error;
}
