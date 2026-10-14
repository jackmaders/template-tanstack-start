/** An expected failure with a message that is safe to display. */
export abstract class ApplicationError extends Error {}

export class InvalidCredentialsError extends ApplicationError {
	constructor() {
		super("The email or password is incorrect.");
		this.name = "InvalidCredentialsError";
	}
}

export class EmailAlreadyRegisteredError extends ApplicationError {
	constructor() {
		super("An account with that email already exists.");
		this.name = "EmailAlreadyRegisteredError";
	}
}

export class PostNotFoundError extends ApplicationError {
	constructor() {
		super("This post is no longer available.");
		this.name = "PostNotFoundError";
	}
}

export class UnauthenticatedError extends ApplicationError {
	constructor() {
		super("Your session has expired. Sign in and try again.");
		this.name = "UnauthenticatedError";
	}
}

export class UnexpectedServerError extends Error {
	constructor() {
		super("Something went wrong. Please try again.");
		this.name = "UnexpectedServerError";
	}
}
