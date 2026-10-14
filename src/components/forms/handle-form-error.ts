import type { AnyFormApi } from "@tanstack/react-form";
import { ApplicationError } from "@/lib/errors";

/** Claim only safe application errors; unfamiliar failures use global feedback. */
export function handleFormError(
	form: Pick<AnyFormApi, "setErrorMap">,
	error: unknown,
) {
	if (!(error instanceof ApplicationError)) {
		return false;
	}
	form.setErrorMap({ onSubmit: { fields: {}, form: error.message } });
	return true;
}
