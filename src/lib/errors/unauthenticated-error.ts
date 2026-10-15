const MESSAGE = "You must be logged in to do this.";

export class UnauthenticatedError extends Error {
	constructor(message = MESSAGE) {
		super(message);
		this.name = "UnauthenticatedError";
	}
}
