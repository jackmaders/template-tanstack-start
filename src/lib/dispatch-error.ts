import { toast } from "@/components/ui/toast-manager";
import { ApplicationError, UnexpectedServerError } from "./errors";
import { reportError } from "./report-error";

const presentedErrors = new WeakSet<object>();
const presentedPrimitives = new Set<unknown>();

export type ErrorHandler = (error: unknown) => boolean;

/** Dispatch caught client failures; only an explicit true claims presentation. */
export function dispatchError(error: unknown, handleError?: ErrorHandler) {
	if (typeof globalThis.window === "undefined") {
		return;
	}

	// Browser presentation state is never read or written during SSR.
	if (
		(typeof error === "object" && error !== null) ||
		typeof error === "function"
	) {
		if (presentedErrors.has(error)) {
			return;
		}
		presentedErrors.add(error);
	} else {
		if (presentedPrimitives.has(error)) {
			return;
		}
		presentedPrimitives.add(error);
		queueMicrotask(() => presentedPrimitives.delete(error));
	}

	if (
		!(
			error instanceof ApplicationError ||
			error instanceof UnexpectedServerError
		)
	) {
		reportError(error, "Client operation failed");
	}
	try {
		if (handleError?.(error) === true) {
			return;
		}
	} catch (failure) {
		reportError(failure, "Error handler failed");
	}

	toast.add({
		description: "Something went wrong. Please try again.",
		priority: "high",
		type: "error",
	});
}
