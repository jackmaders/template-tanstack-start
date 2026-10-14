import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountActions } from "@/features/account/components/account-actions";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { renderWithQuery as render } from "@/testing/wrappers/query-client";

vi.mock("@/lib/auth/auth-client");

test("shows sign-in controls after signing out", async () => {
	// Arrange
	const user = userEvent.setup();
	const session: ReturnType<typeof useSession> = {
		data: {
			session: {
				createdAt: new Date(0),
				expiresAt: new Date(0),
				id: "session-1",
				token: "test-token",
				updatedAt: new Date(0),
				userId: "user-1",
			},
			user: {
				createdAt: new Date(0),
				email: "test@example.com",
				emailVerified: true,
				id: "user-1",
				name: "Test User",
				updatedAt: new Date(0),
			},
		},
		error: null,
		isPending: false,
		isRefetching: false,
		refetch: vi.fn(),
	};
	vi.mocked(useSession).mockReturnValueOnce(session).mockReturnValueOnce({
		data: null,
		error: null,
		isPending: false,
		isRefetching: false,
		refetch: vi.fn(),
	});
	vi.mocked(signOut).mockResolvedValueOnce({
		data: { success: true },
		error: null,
	});
	// Act
	const { rerender } = render(<AccountActions />);
	await user.click(screen.getByRole("button", { name: "Log out" }));
	rerender(<AccountActions />);
	// Assert
	expect(
		screen.queryByRole("button", { name: "Log out" }),
	).not.toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
});

test("waits for the session check before showing account controls", () => {
	// Arrange
	const session = useSession();
	vi.mocked(useSession).mockReturnValueOnce({ ...session, isPending: true });

	// Act
	const { container } = render(<AccountActions />);

	// Assert
	expect(container).toBeEmptyDOMElement();
});

test("shows session failure inline and allows retry without a toast", async () => {
	// Arrange
	const user = userEvent.setup();
	const session = useSession();
	const refetch = vi.fn().mockResolvedValueOnce(undefined);
	vi.mocked(useSession).mockReturnValueOnce({
		...session,
		error: {
			error: {},
			message: "private details",
			name: "BetterFetchError",
			status: 500,
			statusText: "Server Error",
		},
		refetch,
	});

	// Act
	render(<AccountActions />);
	await user.click(screen.getByRole("button", { name: "Try again" }));

	// Assert
	expect(screen.getByRole("alert")).toHaveTextContent(
		"Unable to check your sign-in status. Please try again.",
	);
	expect(refetch).toHaveBeenCalledOnce();
	expect(screen.queryByText("private details")).not.toBeInTheDocument();
});
