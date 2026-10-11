import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "@/components/ui/toast-manager";
import { LogoutButton } from "@/features/account/components/logout-button";
import { signOut } from "@/lib/auth/auth-client";
import {
	DEFAULT_DELAY_MS,
	resolveWithDelay,
} from "@/testing/utils/resolve-with-delay";

vi.mock("@/lib/auth/auth-client");
vi.mock("@/components/ui/toast-manager");

afterEach(() => {
	vi.clearAllTimers();
	vi.useRealTimers();
});

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
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

	const response = { data: { success: true }, error: null };

	vi.mocked(signOut).mockImplementationOnce(() => resolveWithDelay(response));

	// Act
	render(<LogoutButton />);
	await act(async () => {
		fireEvent.click(screen.getByRole("button"));
		await vi.advanceTimersByTimeAsync(DEFAULT_DELAY_MS);
	});

	// Assert
	expect(screen.getByRole("button")).toBeEnabled();
	expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "false");
});

test("calls the click callback after completion", async () => {
	// Arrange
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
	const onClick = vi.fn();
	const response = { data: { success: true }, error: null };
	vi.mocked(signOut).mockImplementationOnce(() => resolveWithDelay(response));

	// Act
	render(<LogoutButton onClick={onClick} />);
	await act(async () => {
		fireEvent.click(screen.getByRole("button"));
		await vi.advanceTimersByTimeAsync(DEFAULT_DELAY_MS);
	});
	// Assert
	expect(onClick).toHaveBeenCalledOnce();
});

test("does not show a toast on success", async () => {
	// Arrange
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

	const response = { data: { success: true }, error: null };
	vi.mocked(signOut).mockImplementationOnce(() => resolveWithDelay(response));
	// Act
	render(<LogoutButton />);
	await act(async () => {
		fireEvent.click(screen.getByRole("button"));
		await vi.advanceTimersByTimeAsync(DEFAULT_DELAY_MS);
	});
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
		description: "Logout failed",
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
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
	const onClick = vi.fn();
	const response = { data: { success: true }, error: null };
	vi.mocked(signOut).mockImplementationOnce(() => resolveWithDelay(response));
	// Act
	render(<LogoutButton onClick={onClick} />);
	await act(async () => {
		fireEvent.click(screen.getByRole("button"));
		await vi.advanceTimersByTimeAsync(DEFAULT_DELAY_MS - 1);
	});
	// Assert
	expect(screen.getByRole("button")).toBeDisabled();
	expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
	expect(onClick).not.toHaveBeenCalled();
});

test("ignores repeated clicks while pending", async () => {
	// Arrange
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
	const onClick = vi.fn();
	const response = { data: { success: true }, error: null };
	vi.mocked(signOut).mockImplementationOnce(() => resolveWithDelay(response));
	// Act
	render(<LogoutButton onClick={onClick} />);
	await act(async () => {
		fireEvent.click(screen.getByRole("button"));
		await vi.advanceTimersByTimeAsync(0);
	});
	await act(async () => {
		fireEvent.click(screen.getByRole("button"));
		await vi.advanceTimersByTimeAsync(DEFAULT_DELAY_MS - 1);
	});
	// Assert
	expect(signOut).toHaveBeenCalledOnce();
});
