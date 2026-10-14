import { ApplicationError } from "@/lib/errors";

/** A submission failure whose message is safe to display to the user. */
export class FormSubmissionError extends ApplicationError {
	constructor(message: string) {
		super("FORM_SUBMISSION", message);
	}
}
