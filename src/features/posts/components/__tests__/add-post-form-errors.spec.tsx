import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "@/components/ui/toast-manager";
import { createPostFn } from "@/features/posts/api/posts.functions";
import { AddPostForm } from "@/features/posts/components/add-post-form";
import { UnauthenticatedError } from "@/lib/errors";
import { renderWithQuery } from "@/testing/wrappers/query-client";

vi.mock("@tanstack/react-start");
vi.mock("@/components/ui/toast-manager");
vi.mock("@/features/posts/api/posts.functions");
vi.mock("@/lib/auth/auth-client");

test("claims application failures inline and keeps the post draft", async () => {
	// Arrange
	const user = userEvent.setup();
	vi.mocked(createPostFn).mockRejectedValueOnce(new UnauthenticatedError());
	renderWithQuery(<AddPostForm />);
	const input = screen.getByRole("textbox", { name: "Post title" });

	// Act
	await user.type(input, "Keep this draft");
	await user.click(screen.getByRole("button", { name: "Add post" }));

	// Assert
	expect(
		await screen.findByText("Your session has expired. Sign in and try again."),
	).toBeVisible();
	expect(input).toHaveValue("Keep this draft");
	expect(toast.add).not.toHaveBeenCalled();
});
