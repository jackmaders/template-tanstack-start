const MESSAGE = "You do not have permission to do this.";

export class ForbiddenError extends Error {
	constructor(message = MESSAGE) {
		super(message);
		this.name = "ForbiddenError";
	}
}
