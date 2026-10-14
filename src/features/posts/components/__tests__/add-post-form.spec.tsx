import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { useCreatePost } from "@/features/posts/api/use-create-post";
import { AddPostForm } from "@/features/posts/components/add-post-form";
import { useSession } from "@/lib/auth/auth-client";

vi.mock("@/features/posts/api/use-create-post");
vi.mock("@/lib/auth/auth-client");

test("renders an empty post form with title constraints", () => {
	// Act
	render(<AddPostForm />);

	const input = screen.getByRole("textbox", { name: "Post title" });

	// Assert
	expect(input).toHaveValue("");
	expect(input).toHaveAttribute("maxlength", String(POST_TITLE_MAX_LENGTH));
	expect(input).toHaveAttribute("autocomplete", "off");
	expect(input).toHaveAttribute("placeholder", "Give your post a title");
	expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();
});

test("creates a post and resets the form after submission", async () => {
	// Arrange
	const user = userEvent.setup();
	const { mutateAsync } = useCreatePost();
	render(<AddPostForm />);
	const input = screen.getByRole("textbox", { name: "Post title" });
	const button = screen.getByRole("button", { name: "Add post" });

	// Act
	await user.type(input, "New post");
	await user.click(button);

	// Assert

	await waitFor(() =>
		expect(mutateAsync).toHaveBeenCalledWith({ title: "New post" }),
	);
	expect(mutateAsync).toHaveBeenCalledOnce();
	await waitFor(() => expect(input).toHaveValue(""));
	await waitFor(() => expect(button).toBeDisabled());
});

test("does not render for anonymous users", () => {
	// Arrange
	vi.mocked(useSession).mockReturnValueOnce({
		data: null,
		error: null,
		isPending: false,
		isRefetching: false,
		refetch: vi.fn(),
	} as ReturnType<typeof useSession>);

	// Act
	const { container } = render(<AddPostForm />);

	// Assert
	expect(container).toBeEmptyDOMElement();
});

test("preserves the title when creation fails", async () => {
	// Arrange
	const user = userEvent.setup();
	const { mutateAsync } = useCreatePost();
	vi.mocked(mutateAsync).mockRejectedValueOnce(new Error("creation failed"));
	render(<AddPostForm />);
	const input = screen.getByRole("textbox", { name: "Post title" });

	// Act
	await user.type(input, "Keep this draft");
	await user.click(screen.getByRole("button", { name: "Add post" }));

	// Assert
	await waitFor(() => expect(mutateAsync).toHaveBeenCalledOnce());
	expect(input).toHaveValue("Keep this draft");
});
