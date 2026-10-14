import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "@/features/account/components/sign-in-form";
import { signIn } from "@/lib/auth/auth-client";
import { createTestPromise } from "@/testing/utils/test-promise";

vi.mock("@/lib/auth/auth-client");

test("forwards form props", () => {
	// Act
	render(<SignInForm aria-label="Account" className="custom-form" />);
	// Assert
	expect(screen.getByRole("form", { name: "Account" })).toHaveClass(
		"custom-form",
	);
});

test("renders fields with the expected properties and submit button", () => {
	// Act
	render(<SignInForm />);
	// Assert
	expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
	expect(screen.getByLabelText("Email")).toHaveAttribute(
		"autocomplete",
		"email",
	);
	expect(screen.getByLabelText("Email")).toBeRequired();
	expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
	expect(screen.getByLabelText("Password")).toHaveAttribute(
		"autocomplete",
		"current-password",
	);
	expect(screen.getByLabelText("Password")).toBeRequired();
	expect(screen.getByRole("button", { name: "Sign In" })).toHaveAttribute(
		"type",
		"submit",
	);
});

test("blocks empty submissions", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(<SignInForm aria-label="Account" />);
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	// Assert
	expect(signIn.email).not.toHaveBeenCalled();
});

test("submits entered values", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signIn.email).mockResolvedValueOnce({ data: null, error: null });
	// Act
	render(<SignInForm />);
	await user.click(screen.getByLabelText("Email"));
	await user.paste("person@example.com");
	await user.click(screen.getByLabelText("Password"));
	await user.paste("password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));

	// Assert
	expect(signIn.email).toHaveBeenCalledExactlyOnceWith({
		email: "person@example.com",
		password: "password",
	});
});

test("disables submission while the request is pending", async () => {
	// Arrange
	const user = userEvent.setup();
	const response = { data: null, error: null };
	const { promise } = createTestPromise(response);
	vi.mocked(signIn.email).mockReturnValueOnce(promise);
	// Act
	render(<SignInForm />);
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));

	// Assert
	expect(screen.getByRole("button", { name: "Please wait…" })).toBeDisabled();
});

test("enables submission after the request completes", async () => {
	// Arrange
	const user = userEvent.setup();
	const response = { data: null, error: null };
	const { promise, resolve } = createTestPromise(response);
	vi.mocked(signIn.email).mockReturnValueOnce(promise);
	// Act
	render(<SignInForm />);
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	await resolve(response);
	// Assert
	expect(screen.getByRole("button", { name: "Sign In" })).toBeEnabled();
});

test("displays authentication errors", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signIn.email).mockResolvedValueOnce({
		data: null,
		error: {
			code: "INVALID_EMAIL_OR_PASSWORD",
			message: "Invalid email or password",
			status: 401,
			statusText: "Unauthorized",
		},
	});
	// Act
	render(<SignInForm />);

	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	// Assert
	expect(
		await screen.findByText("The email or password is incorrect."),
	).toBeVisible();
	expect(
		screen.queryByText("Invalid email or password"),
	).not.toBeInTheDocument();
});

test("displays a safe message when the authentication request rejects", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signIn.email).mockRejectedValueOnce(new Error("Network details"));
	// Act
	render(<SignInForm />);

	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	// Assert
	expect(
		await screen.findByText("Something went wrong. Please try again."),
	).toBeVisible();
	expect(screen.queryByText("Network details")).not.toBeInTheDocument();
});

test("allows retrying after an authentication error", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signIn.email)
		.mockResolvedValueOnce({
			data: null,
			error: {
				code: "INVALID_EMAIL_OR_PASSWORD",
				message: "Invalid email or password",
				status: 401,
				statusText: "Unauthorized",
			},
		})
		.mockResolvedValueOnce({ data: null, error: null });
	// Act
	render(<SignInForm />);

	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	await screen.findByText("The email or password is incorrect.");
	await user.type(screen.getByLabelText("Password"), "corrected");
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	// Assert
	expect(signIn.email).toHaveBeenCalledTimes(2);
	expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
