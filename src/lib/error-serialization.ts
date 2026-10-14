import { createSerializationAdapter } from "@tanstack/react-router";
import {
	EmailAlreadyRegisteredError,
	InvalidCredentialsError,
	PostNotFoundError,
	UnauthenticatedError,
	UnexpectedServerError,
} from "./errors";

// Serialize only the error's identity. Constructors supply safe messages;
// server stacks, causes, and arbitrary properties never cross the boundary.
export const errorSerializationAdapters = [
	createErrorAdapter("InvalidCredentialsError", InvalidCredentialsError),
	createErrorAdapter(
		"EmailAlreadyRegisteredError",
		EmailAlreadyRegisteredError,
	),
	createErrorAdapter("PostNotFoundError", PostNotFoundError),
	createErrorAdapter("UnauthenticatedError", UnauthenticatedError),
	createErrorAdapter("UnexpectedServerError", UnexpectedServerError),
];

function createErrorAdapter<T extends Error>(
	key: string,
	ErrorClass: new () => T,
) {
	return createSerializationAdapter({
		fromSerializable: () => new ErrorClass(),
		key,
		test: (value): value is T => value instanceof ErrorClass,
		toSerializable: () => null,
	});
}
