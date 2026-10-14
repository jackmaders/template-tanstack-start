import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "@/components/ui/toast-manager";
import { LogoutButton } from "@/features/account/components/logout-button";
import { signOut } from "@/lib/auth/auth-client";
import { createTestPromise } from "@/testing/utils/test-promise";

vi.mock("@/lib/auth/auth-client");
vi.mock("@/components/ui/toast-manager");

test("renders the default label and button type", () => {
	// Act
	render(<LogoutButton />);
	// Assert
	expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
	expect(screen.getByRole("button")).toHaveAttribute("type", "button");
});

test("renders a custom label", () => {
	// Act
	render(<LogoutButton>Leave</LogoutButton>);
	// Assert
	expect(screen.getByRole("button", { name: "Leave" })).toBeInTheDocument();
});

test("forwards button props", () => {
	// Act
	render(<LogoutButton className="custom" />);
	// Assert
	expect(screen.getByRole("button")).toHaveClass("custom");
});

test("respects the disabled prop", () => {
	// Act
	render(<LogoutButton disabled={true} />);
	// Assert
	expect(screen.getByRole("button")).toBeDisabled();
});

test("does not sign out when disabled", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(<LogoutButton disabled={true} />);
	await user.click(screen.getByRole("button"));
	// Assert
	expect(signOut).not.toHaveBeenCalled();
});

test("enables the button and clears its busy state after completion", async () => {
	// Arrange
	const user = userEvent.setup();
	const response = { data: { success: true }, error: null };
	const { promise, resolve } = createTestPromise(response);
	vi.mocked(signOut).mockReturnValueOnce(promise);

	// Act
	render(<LogoutButton />);
	await user.click(screen.getByRole("button"));
	await resolve(response);

	// Assert
	expect(screen.getByRole("button")).toBeEnabled();
	expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "false");
});

test("calls the click callback after completion", async () => {
	// Arrange
	const user = userEvent.setup();
	const onClick = vi.fn();
	const response = { data: { success: true }, error: null };
	const { promise, resolve } = createTestPromise(response);
	vi.mocked(signOut).mockReturnValueOnce(promise);

	// Act
	render(<LogoutButton onClick={onClick} />);
	await user.click(screen.getByRole("button"));
	await resolve(response);

	// Assert
	expect(onClick).toHaveBeenCalledOnce();
});

test("does not show a toast on success", async () => {
	// Arrange
	const user = userEvent.setup();
	const response = { data: { success: true }, error: null };
	const { promise, resolve } = createTestPromise(response);
	vi.mocked(signOut).mockReturnValueOnce(promise);

	// Act
	render(<LogoutButton />);
	await user.click(screen.getByRole("button"));

	await resolve(response);

	// Assert
	expect(toast.add).not.toHaveBeenCalled();
});

test("shows server errors in a toast", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(signOut).mockResolvedValueOnce({
		data: null,
		error: {
			message: "Logout failed",
			status: 500,
			statusText: "Internal Server Error",
		},
	});
	// Act
	render(<LogoutButton />);
	await user.click(screen.getByRole("button"));
	// Assert
	expect(toast.add).toHaveBeenCalledExactlyOnceWith({
		description: "Unable to log out. Please try again.",
		priority: "high",
		type: "error",
	});
});

test("enables the button after a failed logout", async () => {
	// Arrange
	const user = userEvent.setup();

	vi.mocked(signOut).mockResolvedValueOnce({
		data: null,
		error: {
			message: "Logout failed",
			status: 500,
			statusText: "Internal Server Error",
		},
	});
	// Act
	render(<LogoutButton />);
	await user.click(screen.getByRole("button"));
	// Assert
	expect(screen.getByRole("button")).toBeEnabled();
});

test("calls the click callback after a failed logout", async () => {
	// Arrange
	const user = userEvent.setup();
	const onClick = vi.fn();

	vi.mocked(signOut).mockResolvedValueOnce({
		data: null,
		error: {
			message: "Logout failed",
			status: 500,
			statusText: "Internal Server Error",
		},
	});
	// Act
	render(<LogoutButton onClick={onClick} />);
	await user.click(screen.getByRole("button"));
	// Assert
	expect(onClick).toHaveBeenCalledOnce();
});

test("disables the button, marks it busy, and defers the callback while pending", async () => {
	// Arrange
	const user = userEvent.setup();
	const onClick = vi.fn();
	const response = { data: { success: true }, error: null };
	const { promise } = createTestPromise(response);
	vi.mocked(signOut).mockReturnValueOnce(promise);
	// Act
	render(<LogoutButton onClick={onClick} />);
	await user.click(screen.getByRole("button"));
	// Assert
	expect(screen.getByRole("button")).toBeDisabled();
	expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
	expect(onClick).not.toHaveBeenCalled();
});

test("ignores repeated clicks while pending", async () => {
	// Arrange
	const user = userEvent.setup();
	const onClick = vi.fn();
	const response = { data: { success: true }, error: null };
	const { promise } = createTestPromise(response);
	vi.mocked(signOut).mockReturnValueOnce(promise);
	// Act
	render(<LogoutButton onClick={onClick} />);
	await user.click(screen.getByRole("button"));
	await user.click(screen.getByRole("button"));
	// Assert
	expect(signOut).toHaveBeenCalledOnce();
});
