import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "@/components/ui/toast-manager";
import { dispatchError } from "@/lib/dispatch-error";
import { InvalidCredentialsError, UnexpectedServerError } from "@/lib/errors";
import { getRouter } from "@/router";
import { createRouterTestContext } from "@/testing/wrappers/router";

vi.mock("@/components/ui/toast-manager");
vi.mock("@/db/db.server.ts");
vi.mock("@/lib/auth/auth.server.ts");
vi.mock("@tanstack/react-router-ssr-query");

test("claims route failures, hides private details, and resets query recovery on retry", async () => {
	// Arrange
	const user = userEvent.setup();
	const { wrapper } = await createRouterTestContext();
	const ErrorComponent = getRouter().options.defaultErrorComponent;
	if (!ErrorComponent) {
		throw new Error("Missing route fallback");
	}
	const reset = vi.fn();
	let queryWasReset = false;

	// Act
	render(
		<QueryErrorResetBoundary>
			{(boundary) => {
				const resetRoute = () => {
					queryWasReset = boundary.isReset();
					reset();
				};
				return (
					<ErrorComponent
						error={new Error("private database details")}
						reset={resetRoute}
					/>
				);
			}}
		</QueryErrorResetBoundary>,
		{ wrapper },
	);
	await user.click(screen.getByRole("button", { name: "Try again" }));

	// Assert
	expect(screen.getByText("We couldn't load this page.")).toBeVisible();
	expect(
		screen.queryByText("private database details"),
	).not.toBeInTheDocument();
	expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute(
		"href",
		"/",
	);
	expect(reset).toHaveBeenCalledOnce();
	expect(queryWasReset).toBe(true);
	expect(toast.add).not.toHaveBeenCalled();
});

test.each([
	[new InvalidCredentialsError(), 0],
	[new UnexpectedServerError(), 0],
	[new Error("route failure"), 1],
] as const)(
	"reports unexpected route failures once across route and query dispatch (%s)",
	(error, reports) => {
		// Arrange
		const router = getRouter();
		const report = vi
			.spyOn(console, "error")
			.mockImplementationOnce(() => undefined);

		// Act
		router.options.defaultOnCatch?.(error, { componentStack: "" });
		dispatchError(error, () => true);

		// Assert
		expect(report).toHaveBeenCalledTimes(reports);
		expect(toast.add).not.toHaveBeenCalled();
	},
);

test("displays safe application messages in the route recovery UI", async () => {
	// Arrange
	const { wrapper } = await createRouterTestContext();
	const ErrorComponent = getRouter().options.defaultErrorComponent;
	if (!ErrorComponent) {
		throw new Error("Missing route fallback");
	}

	// Act
	render(
		<ErrorComponent error={new InvalidCredentialsError()} reset={vi.fn()} />,
		{ wrapper },
	);

	// Assert
	expect(screen.getByText("The email or password is incorrect.")).toBeVisible();
	expect(toast.add).not.toHaveBeenCalled();
});
