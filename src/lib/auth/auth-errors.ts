import { FormSubmissionError } from "@/components/forms/form-submission-error";
import {
	APPLICATION_ERROR_CODES,
	ApplicationError,
	type ApplicationErrorCode,
	reportUnexpectedError,
} from "@/lib/errors";

interface AuthClientError {
	code?: string;
	status?: number;
}

type AuthAction = "signIn" | "signOut" | "signUp" | "session";
const CLIENT_ERROR_STATUS = 400;
const SERVER_ERROR_STATUS = 500;

const expectedAuthErrors: Partial<
	Record<AuthAction, ReadonlyMap<string, ApplicationErrorCode>>
> = {
	signIn: new Map([
		["INVALID_EMAIL_OR_PASSWORD", APPLICATION_ERROR_CODES.invalidCredentials],
		["INVALID_PASSWORD", APPLICATION_ERROR_CODES.invalidCredentials],
	]),
	signUp: new Map([
		["USER_ALREADY_EXISTS", APPLICATION_ERROR_CODES.emailAlreadyRegistered],
		[
			"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
			APPLICATION_ERROR_CODES.emailAlreadyRegistered,
		],
	]),
};

const fallbackMessages: Record<AuthAction, string> = {
	session: "Unable to check your sign-in status. Please try again.",
	signIn: "Unable to sign in. Please try again.",
	signOut: "Unable to log out. Please try again.",
	signUp: "Unable to sign up. Please try again.",
};

export function toAuthSubmissionError(
	error: AuthClientError,
	action: AuthAction,
) {
	const code = getExpectedAuthErrorCode(error, action);
	return code
		? new ApplicationError(code)
		: new FormSubmissionError(fallbackMessages[action]);
}

export function reportAuthFailureIfUnexpected(
	error: unknown,
	action: AuthAction,
) {
	if (getExpectedAuthErrorCode(error, action)) {
		return;
	}

	reportUnexpectedError(error, `Better Auth ${action} failed`);
}

function getExpectedAuthErrorCode(
	error: unknown,
	action: AuthAction,
): ApplicationErrorCode | null {
	if (
		typeof error !== "object" ||
		error === null ||
		!("status" in error) ||
		!("code" in error)
	) {
		return null;
	}

	const { code, status } = error;
	if (
		typeof status !== "number" ||
		status < CLIENT_ERROR_STATUS ||
		status >= SERVER_ERROR_STATUS ||
		typeof code !== "string"
	) {
		return null;
	}

	return expectedAuthErrors[action]?.get(code) ?? null;
}
