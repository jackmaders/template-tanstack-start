import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/features/account/components/sign-up-form";
import { signUp } from "@/lib/auth/auth-client";
import { createTestPromise } from "@/testing/utils/test-promise";

vi.mock("@/lib/auth/auth-client");

it("forwards form props", () => {
	// Act
	render(<SignUpForm aria-label="Account" className="custom-form" />);
	// Assert
	expect(screen.getByRole("form", { name: "Account" })).toHaveClass(
		"custom-form",
	);
});

it("renders fields with the expected properties and submit button", () => {
	// Act
	render(<SignUpForm />);
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
		"new-password",
	);
	expect(screen.getByLabelText("Password")).toBeRequired();
	expect(screen.getByLabelText("Name")).toHaveAttribute("autocomplete", "name");
	expect(screen.getByLabelText("Name")).toBeRequired();
	expect(screen.getByRole("button", { name: "Sign up" })).toHaveAttribute(
		"type",
		"submit",
	);
});

it("blocks empty submissions", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(<SignUpForm aria-label="Account" />);
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	// Assert
	expect(signUp.email).not.toHaveBeenCalled();
});

it("submits entered values", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signUp.email).mockResolvedValueOnce({ data: null, error: null });
	// Act
	render(<SignUpForm />);
	await user.click(screen.getByLabelText("Name"));
	await user.paste("Person");
	await user.click(screen.getByLabelText("Email"));
	await user.paste("person@example.com");
	await user.click(screen.getByLabelText("Password"));
	await user.paste("password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));

	// Assert
	expect(signUp.email).toHaveBeenCalledExactlyOnceWith({
		email: "person@example.com",
		name: "Person",
		password: "password",
	});
});

it("disables submission while the request is pending", async () => {
	// Arrange
	const user = userEvent.setup();
	const response = { data: null, error: null };
	const { promise } = createTestPromise(response);
	vi.mocked(signUp.email).mockReturnValueOnce(promise);
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));

	// Assert
	expect(screen.getByRole("button", { name: "Please wait…" })).toBeDisabled();
});

it("enables submission after the request completes", async () => {
	// Arrange
	const user = userEvent.setup();
	const response = { data: null, error: null };
	const { promise, resolve } = createTestPromise(response);
	vi.mocked(signUp.email).mockReturnValueOnce(promise);
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	await resolve(response);
	// Assert
	expect(screen.getByRole("button", { name: "Sign up" })).toBeEnabled();
});

it("displays authentication errors", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signUp.email).mockResolvedValueOnce({
		data: null,
		error: {
			message: "An account already exists",
			status: 401,
			statusText: "Unauthorized",
		},
	});
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	// Assert
	expect(await screen.findByText("An account already exists")).toBeVisible();
});

it("displays a safe message when the authentication request rejects", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signUp.email).mockRejectedValueOnce(new Error("Network details"));
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	// Assert
	expect(
		await screen.findByText("Something went wrong. Please try again."),
	).toBeVisible();
	expect(screen.queryByText("Network details")).not.toBeInTheDocument();
});

it("allows retrying after an authentication error", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signUp.email)
		.mockResolvedValueOnce({
			data: null,
			error: { message: "Try again", status: 401, statusText: "Unauthorized" },
		})
		.mockResolvedValueOnce({ data: null, error: null });
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	await screen.findByText("Try again");
	await user.type(screen.getByLabelText("Password"), "corrected");
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	// Assert
	expect(signUp.email).toHaveBeenCalledTimes(2);
	expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
