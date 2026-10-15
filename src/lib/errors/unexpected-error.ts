const MESSAGE = "An unexpected error occurred.";

export class UnexpectedError extends Error {
	constructor(message = MESSAGE) {
		super(message);
		this.name = "UnexpectedError";
	}
}
