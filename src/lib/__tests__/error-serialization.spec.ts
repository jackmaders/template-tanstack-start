import { runInNewContext } from "node:vm";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
} from "@tanstack/react-router";
import { attachRouterServerSsrUtils } from "@tanstack/react-router/ssr/server";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { onTestFinished } from "vitest";
import { errorSerializationAdapters } from "@/lib/error-serialization";
import {
	EmailAlreadyRegisteredError,
	InvalidCredentialsError,
	PostNotFoundError,
	UnauthenticatedError,
	UnexpectedServerError,
} from "@/lib/errors";

vi.mock("@/features/posts/api/posts.functions");

const errorClasses = [
	InvalidCredentialsError,
	EmailAlreadyRegisteredError,
	PostNotFoundError,
	UnauthenticatedError,
	UnexpectedServerError,
];

test.each(errorClasses)(
	"reconstructs %s through the registered transport adapter",
	(ErrorClass) => {
		// Arrange
		const error = new ErrorClass();
		error.stack = "private stack";
		error.cause = new Error("private database details");
		const adapter = errorSerializationAdapters.find((candidate) =>
			candidate.test(error),
		);
		if (!adapter) {
			throw new Error("Missing adapter");
		}

		// Act
		const serialized = JSON.stringify(adapter.toSerializable(error));
		const restored = adapter.fromSerializable(JSON.parse(serialized));

		// Assert
		expect(restored).toBeInstanceOf(ErrorClass);
		expect(restored.message).toBe(error.message);
		expect(serialized).not.toContain("private");
		expect(restored.cause).toBeUndefined();
	},
);

test("hydrates concrete errors from TanStack's server-generated hydration script", async () => {
	// Arrange
	const errors = errorClasses.map((ErrorClass) => new ErrorClass());
	const router = createRouter({
		dehydrate: () => ({ errors }),
		history: createMemoryHistory({ initialEntries: ["/"] }),
		routeTree: createRootRoute(),
	});
	router.options.serializationAdapters = errorSerializationAdapters;
	await router.load();
	attachRouterServerSsrUtils({ manifest: undefined, router });

	// Act
	await router.serverSsr?.dehydrate();
	const scripts = router.serverSsr?.takeInitialHydrationScriptTags();

	if (!scripts) {
		throw new Error("Missing hydration scripts");
	}
	const source = scripts.before.map((script) => script.children).join(";");
	const hydrated = runInNewContext(
		`globalThis.self = globalThis; ${source}; $_TSR.t = adapters; $_TSR.initialized = true; for (const resume of $_TSR.buffer) resume(); $_TSR.router.dehydratedData;`,
		{
			adapters: new Map(
				errorSerializationAdapters.map((adapter) => [
					adapter.key,
					adapter.fromSerializable,
				]),
			),
			document: {
				currentScript: {
					previousElementSibling: null,
					remove: () => undefined,
				},
			},
		},
	) as { errors: Error[] };
	router.serverSsr?.cleanup();

	// Assert
	expect(hydrated.errors).toEqual([
		expect.any(InvalidCredentialsError),
		expect.any(EmailAlreadyRegisteredError),
		expect.any(PostNotFoundError),
		expect.any(UnauthenticatedError),
		expect.any(UnexpectedServerError),
	]);
});

test("can hydrate server query data whose options register a local error handler", async () => {
	// Arrange
	vi.stubGlobal("window", undefined);
	const { createQueryClient } = await import("@/lib/query-client");
	const { postsQueryOptions } = await import(
		"@/features/posts/api/posts-query-options"
	);
	const queryClient = createQueryClient();
	await queryClient.fetchQuery({
		...postsQueryOptions,
		queryFn: () => Promise.resolve([]),
	});
	const router = createRouter({
		history: createMemoryHistory({ initialEntries: ["/"] }),
		isServer: true,
		routeTree: createRootRoute(),
	});
	router.options.serializationAdapters = errorSerializationAdapters;
	await router.load();
	setupRouterSsrQueryIntegration({ queryClient, router });
	onTestFinished(() => {
		router.serverSsr?.cleanup();
		queryClient.clear();
	});
	attachRouterServerSsrUtils({ manifest: undefined, router });

	// Act
	const result = router.serverSsr?.dehydrate();

	// Assert
	await expect(result).resolves.toBeUndefined();
	expect(router.serverSsr?.takeInitialHydrationScriptTags()).toBeDefined();
});
