import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "@/features/account/components/sign-in-form";
import { signIn } from "@/lib/auth/auth-client";
import { advanceTimers } from "@/testing/utils/advance-timers";
import { resolveWithDelay } from "@/testing/utils/resolve-with-delay";

vi.mock("@/lib/auth/auth-client");

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
	vi.useFakeTimers({
		shouldAdvanceTime: true,
		toFake: ["setTimeout", "clearTimeout"],
	});

	user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
});

afterEach(() => {
	vi.clearAllTimers();
	vi.useRealTimers();
});

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
	// Act
	render(<SignInForm aria-label="Account" />);
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	// Assert
	expect(signIn.email).not.toHaveBeenCalled();
});

test("submits entered values", async () => {
	// Arrange
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
	const response = { data: null, error: null };
	vi.mocked(signIn.email).mockImplementationOnce(() =>
		resolveWithDelay(response),
	);
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
	const response = { data: null, error: null };
	vi.mocked(signIn.email).mockImplementationOnce(() =>
		resolveWithDelay(response),
	);
	// Act
	render(<SignInForm />);
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign In" }));
	await advanceTimers();
	// Assert
	expect(screen.getByRole("button", { name: "Sign In" })).toBeEnabled();
});
