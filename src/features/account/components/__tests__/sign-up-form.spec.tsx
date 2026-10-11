import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/features/account/components/sign-up-form";
import { signUp } from "@/lib/auth/auth-client";
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
	render(<SignUpForm aria-label="Account" className="custom-form" />);
	// Assert
	expect(screen.getByRole("form", { name: "Account" })).toHaveClass(
		"custom-form",
	);
});

test("renders fields with the expected properties and submit button", () => {
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

test("blocks empty submissions", async () => {
	// Act
	render(<SignUpForm aria-label="Account" />);
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	// Assert
	expect(signUp.email).not.toHaveBeenCalled();
});

test("submits entered values", async () => {
	// Arrange
	vi.mocked(signUp.email).mockResolvedValueOnce({ data: null, error: null });
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));

	// Assert
	expect(signUp.email).toHaveBeenCalledExactlyOnceWith({
		email: "person@example.com",
		name: "Person",
		password: "password",
	});
});

test("disables submission while the request is pending", async () => {
	// Arrange
	const response = { data: null, error: null };
	vi.mocked(signUp.email).mockImplementationOnce(() =>
		resolveWithDelay(response),
	);
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));

	// Assert
	expect(screen.getByRole("button", { name: "Please wait…" })).toBeDisabled();
});

test("enables submission after the request completes", async () => {
	// Arrange
	const response = { data: null, error: null };
	vi.mocked(signUp.email).mockImplementationOnce(() =>
		resolveWithDelay(response),
	);
	// Act
	render(<SignUpForm />);
	await user.type(screen.getByLabelText("Name"), "Person");
	await user.type(screen.getByLabelText("Email"), "person@example.com");
	await user.type(screen.getByLabelText("Password"), "password");
	await user.click(screen.getByRole("button", { name: "Sign up" }));
	await advanceTimers();
	// Assert
	expect(screen.getByRole("button", { name: "Sign up" })).toBeEnabled();
});
