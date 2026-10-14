import { errorSerializationAdapters } from "@/lib/error-serialization";
import { serverErrorMiddleware } from "@/lib/server-error-middleware";
import { startInstance } from "@/start";

test("registers error transport and middleware while preserving server-function CSRF protection", async () => {
	// Act
	const options = await startInstance.getOptions();
	const [csrf] = options.requestMiddleware ?? [];
	if (!csrf) {
		throw new Error("Missing CSRF middleware");
	}
	const next = vi.fn();
	const context = undefined;
	const request = new Request("https://app.example.com/_serverFn/test", {
		headers: { origin: "https://attacker.example.com" },
		method: "POST",
	});
	const response = await csrf.options.server?.({
		context,
		handlerType: "serverFn",
		next,
		pathname: "/_serverFn/test",
		request,
	});

	// Assert
	expect(options.serializationAdapters).toEqual(errorSerializationAdapters);
	expect(options.functionMiddleware).toEqual([serverErrorMiddleware]);
	expect(response).toBeInstanceOf(Response);
	expect((response as Response).status).toBe(403);
	expect(next).not.toHaveBeenCalled();
});
