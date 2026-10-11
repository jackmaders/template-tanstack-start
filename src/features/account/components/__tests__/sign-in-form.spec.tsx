import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "@/features/account/components/sign-in-form";
import { signIn } from "@/lib/auth/auth-client";

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
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
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
	const { promise, resolve } = Promise.withResolvers();
	vi.mocked(signIn.email).mockReturnValueOnce(promise);
	// Act
	render(<SignInForm />);
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));

	// Assert
	expect(screen.getByRole("button", { name: "Please wait…" })).toBeDisabled();

	await act(async () => {
		resolve(response);
		await promise;
	});
});

test("enables submission after the request completes", async () => {
	// Arrange
	const user = userEvent.setup();
	const response = { data: null, error: null };
	const { promise, resolve } = Promise.withResolvers();
	vi.mocked(signIn.email).mockReturnValueOnce(promise);
	// Act
	render(<SignInForm />);
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	await act(async () => {
		resolve(response);
		await promise;
	});
	// Assert
	expect(screen.getByRole("button", { name: "Sign In" })).toBeEnabled();
});
