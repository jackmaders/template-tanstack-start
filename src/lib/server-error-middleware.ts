import { isNotFound, isRedirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { ApplicationError, UnexpectedServerError } from "./errors";
import { reportError } from "./report-error";

export const serverErrorMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (
			error instanceof ApplicationError ||
			error instanceof UnexpectedServerError ||
			isRedirect(error) ||
			isNotFound(error)
		) {
			throw error;
		}
		reportError(error, "Server function failed");
		// biome-ignore lint/style/useErrorCause: The original is reported above; transport errors must contain no internal details.
		throw new UnexpectedServerError();
	}
});
