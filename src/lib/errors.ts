export const APPLICATION_ERROR_CODES = {
	emailAlreadyRegistered: "EMAIL_ALREADY_REGISTERED",
	formSubmission: "FORM_SUBMISSION",
	invalidCredentials: "INVALID_CREDENTIALS",
	postNotFound: "POST_NOT_FOUND",
	unauthenticated: "UNAUTHENTICATED",
} as const;

export type ApplicationErrorCode =
	(typeof APPLICATION_ERROR_CODES)[keyof typeof APPLICATION_ERROR_CODES];

const applicationErrorMessages: Record<ApplicationErrorCode, string> = {
	[APPLICATION_ERROR_CODES.emailAlreadyRegistered]:
		"An account with that email already exists.",
	[APPLICATION_ERROR_CODES.formSubmission]:
		"Something went wrong. Please try again.",
	[APPLICATION_ERROR_CODES.invalidCredentials]:
		"The email or password is incorrect.",
	[APPLICATION_ERROR_CODES.postNotFound]: "This post is no longer available.",
	[APPLICATION_ERROR_CODES.unauthenticated]:
		"Your session has expired. Sign in and try again.",
};
export class ApplicationError extends Error {
	readonly code: ApplicationErrorCode;

	constructor(
		code: ApplicationErrorCode,
		message = applicationErrorMessages[code],
	) {
		super(message);
		this.name = "ApplicationError";
		this.code = code;
	}
}

const reportedErrors = new WeakSet<object>();

function getApplicationErrorCode(error: unknown): ApplicationErrorCode | null {
	if (typeof error !== "object" || error === null || !("code" in error)) {
		return null;
	}

	const { code } = error;
	return typeof code === "string" &&
		Object.hasOwn(applicationErrorMessages, code)
		? (code as ApplicationErrorCode)
		: null;
}

export function normalizeApplicationError(error: unknown) {
	const code = getApplicationErrorCode(error);
	return code ? new ApplicationError(code) : null;
}

export async function withApplicationErrorNormalization<T>(
	operation: () => Promise<T>,
) {
	try {
		return await operation();
	} catch (error) {
		throw normalizeApplicationError(error) ?? error;
	}
}

export function getUserFacingErrorMessage(
	error: unknown,
	fallback = "Something went wrong. Please try again.",
) {
	const code = getApplicationErrorCode(error);
	if (!code) {
		return fallback;
	}

	if (
		code === "FORM_SUBMISSION" &&
		typeof error === "object" &&
		error !== null &&
		"message" in error
	) {
		return typeof error.message === "string" ? error.message : fallback;
	}

	return applicationErrorMessages[code];
}

export function reportUnexpectedError(error: unknown, context: string) {
	if (getApplicationErrorCode(error)) {
		return;
	}

	if (typeof error === "object" && error !== null) {
		if (reportedErrors.has(error)) {
			return;
		}
		reportedErrors.add(error);
	}

	// biome-ignore lint/suspicious/noConsole: Report unexpected errors until an application telemetry adapter exists.
	console.error(`[${context}]`, error);
}
