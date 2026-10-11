import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { useCreatePost } from "@/features/posts/api/use-create-post";
import { AddPostForm } from "@/features/posts/components/add-post-form";

vi.mock("@/features/posts/api/use-create-post");

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
