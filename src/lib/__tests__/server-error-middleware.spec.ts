import { notFound, redirect } from "@tanstack/react-router";
import { PostNotFoundError, UnexpectedServerError } from "@/lib/errors";
import { serverErrorMiddleware } from "@/lib/server-error-middleware";

vi.mock("@tanstack/react-start");

test("reports the original server failure and substitutes a safe error", async () => {
	// Arrange
	const error = new Error("secret SQL connection details");
	const report = vi
		.spyOn(console, "error")
		.mockImplementationOnce(() => undefined);
	const next = vi.fn().mockRejectedValueOnce(error);

	// Act
	const result = (
		serverErrorMiddleware as unknown as (options: {
			next: typeof next;
		}) => Promise<unknown>
	)({ next });

	// Assert
	await expect(result).rejects.toBeInstanceOf(UnexpectedServerError);
	await expect(result).rejects.toThrow(
		"Something went wrong. Please try again.",
	);
	expect(report).toHaveBeenCalledExactlyOnceWith(
		"[Server function failed]",
		error,
	);
});

test.each([
	new PostNotFoundError(),
	new UnexpectedServerError(),
	redirect({ to: "/" }),
	notFound(),
])(
	"preserves application errors and router control flow (%s)",
	async (error) => {
		// Arrange
		const next = vi.fn().mockRejectedValueOnce(error);

		// Act
		const result = (
			serverErrorMiddleware as unknown as (options: {
				next: typeof next;
			}) => Promise<unknown>
		)({ next });

		// Assert
		await expect(result).rejects.toBe(error);
	},
);

test("still substitutes a safe server error when reporting throws", async () => {
	// Arrange
	vi.spyOn(console, "error").mockImplementationOnce(() => {
		throw new Error("reporting failure");
	});
	const next = vi.fn().mockRejectedValueOnce(new Error("database secrets"));

	// Act
	const result = (
		serverErrorMiddleware as unknown as (options: {
			next: typeof next;
		}) => Promise<unknown>
	)({ next });

	// Assert
	await expect(result).rejects.toBeInstanceOf(UnexpectedServerError);
});

test("forwards successful server operations unchanged", async () => {
	// Arrange
	const response = { context: {}, result: "Saved", sendContext: {} };
	const next = vi.fn().mockResolvedValueOnce(response);

	// Act
	const result = (
		serverErrorMiddleware as unknown as (options: {
			next: typeof next;
		}) => Promise<unknown>
	)({ next });

	// Assert
	await expect(result).resolves.toBe(response);
});
