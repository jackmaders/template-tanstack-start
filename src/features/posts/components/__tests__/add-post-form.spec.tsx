import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { useCreatePost } from "@/features/posts/api/use-create-post";
import { AddPostForm } from "@/features/posts/components/add-post-form";

vi.mock("@/features/posts/api/use-create-post");

test("renders an empty post form with title constraints", () => {
	render(<AddPostForm />);

	const input = screen.getByRole("textbox", { name: "Post title" });
	expect(input).toHaveValue("");
	expect(input).toHaveAttribute("maxlength", String(POST_TITLE_MAX_LENGTH));
	expect(input).toHaveAttribute("autocomplete", "off");
	expect(input).toHaveAttribute("placeholder", "Give your post a title");
	expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();
});

test("creates a post and resets the form after submission", async () => {
	const { mutateAsync } = useCreatePost();
	render(<AddPostForm />);
	const input = screen.getByRole("textbox", { name: "Post title" });
	const button = screen.getByRole("button", { name: "Add post" });

	fireEvent.change(input, { target: { value: "New post" } });
	await waitFor(() => expect(button).toBeEnabled());
	fireEvent.click(button);

	await waitFor(() =>
		expect(mutateAsync).toHaveBeenCalledWith({ title: "New post" }),
	);
	expect(mutateAsync).toHaveBeenCalledOnce();
	await waitFor(() => expect(input).toHaveValue(""));
	await waitFor(() => expect(button).toBeDisabled());
});
