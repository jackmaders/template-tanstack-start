import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountActions } from "@/features/account/components/account-actions";
import { signOut, useSession } from "@/lib/auth/auth-client";

vi.mock("@/lib/auth/auth-client");

it("shows sign-in controls after signing out", async () => {
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
