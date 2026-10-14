import { createCsrfMiddleware, createStart } from "@tanstack/react-start";
import { errorSerializationAdapters } from "./lib/error-serialization";
import { serverErrorMiddleware } from "./lib/server-error-middleware";

const csrfMiddleware = createCsrfMiddleware({
	filter: (context) => context.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
	functionMiddleware: [serverErrorMiddleware],
	requestMiddleware: [csrfMiddleware],
	serializationAdapters: errorSerializationAdapters,
}));
