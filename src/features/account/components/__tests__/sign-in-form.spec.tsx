import { act, fireEvent, render, screen } from "@testing-library/react";
import { SignInForm } from "@/features/account/components/sign-in-form";
import { signIn } from "@/lib/auth/auth-client";
import {
	DEFAULT_DELAY_MS,
	resolveWithDelay,
} from "@/testing/utils/resolve-with-delay";

vi.mock("@/lib/auth/auth-client");

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
	await act(async () => {
		await Promise.resolve();
		fireEvent.submit(screen.getByRole("form", { name: "Account" }));
	});
	// Assert
	expect(signIn.email).not.toHaveBeenCalled();
});

test("submits entered values", async () => {
	// Arrange
	vi.mocked(signIn.email).mockResolvedValueOnce({ data: null, error: null });
	// Act
	render(<SignInForm />);
	await act(async () => {
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "person@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
	});
	// Assert
	expect(signIn.email).toHaveBeenCalledExactlyOnceWith({
		email: "person@example.com",
		password: "password",
	});
});

test("disables submission while the request is pending", async () => {
	// Arrange
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
	const response = { data: null, error: null };
	vi.mocked(signIn.email).mockImplementationOnce(() =>
		resolveWithDelay(response),
	);
	// Act
	render(<SignInForm />);
	await act(async () => {
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "person@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
	});
	// Assert
	expect(screen.getByRole("button", { name: "Please wait…" })).toBeDisabled();
});

test("enables submission after the request completes", async () => {
	// Arrange
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
	const response = { data: null, error: null };
	vi.mocked(signIn.email).mockImplementationOnce(() =>
		resolveWithDelay(response),
	);
	// Act
	render(<SignInForm />);
	await act(async () => {
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "person@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
		await vi.advanceTimersByTimeAsync(DEFAULT_DELAY_MS);
	});
	// Assert
	expect(screen.getByRole("button", { name: "Sign In" })).toBeEnabled();
});
