import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { mutateAsync } from "@/features/posts/api/__mocks__/use-create-post";
import { AddPostForm } from "../add-post-form";

vi.mock("@/features/posts/api/use-create-post");

function getForm() {
	const form = screen
		.getByRole("textbox", { name: "Post title" })
		.closest("form");
	if (!form) {
		throw new Error("Expected the add post form to be rendered");
	}
	return form;
}

test("renders the title field and prevents submitting an empty title", () => {
	render(<AddPostForm />);

	const titleInput = screen.getByRole("textbox", { name: "Post title" });
	const submitButton = screen.getByRole("button", { name: "Add post" });

	expect(screen.getByText("Add a post")).toBeInTheDocument();
	expect(titleInput).toHaveAttribute("placeholder", "Give your post a title");
	expect(titleInput).toHaveAttribute("autocomplete", "off");
	expect(titleInput).toHaveAttribute(
		"maxlength",
		String(POST_TITLE_MAX_LENGTH),
	);
	expect(submitButton).toBeDisabled();

	fireEvent.submit(getForm());
	expect(mutateAsync).not.toHaveBeenCalled();
});

test("shows validation for a whitespace-only title and allows correction", async () => {
	render(<AddPostForm />);

	const titleInput = screen.getByRole("textbox", { name: "Post title" });
	fireEvent.change(titleInput, { target: { value: "   " } });
	fireEvent.blur(titleInput);

	await waitFor(() =>
		expect(titleInput).toHaveAttribute("aria-invalid", "true"),
	);
	expect(screen.getByRole("alert")).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();

	fireEvent.change(titleInput, { target: { value: "A useful post" } });

	await waitFor(() =>
		expect(titleInput).toHaveAttribute("aria-invalid", "false"),
	);
	expect(screen.getByRole("button", { name: "Add post" })).toBeEnabled();
});

test("creates a post and resets the form after successful submission", async () => {
	mutateAsync.mockResolvedValueOnce({ id: 1, title: "A useful post" });
	render(<AddPostForm />);

	const titleInput = screen.getByRole("textbox", { name: "Post title" });
	fireEvent.change(titleInput, { target: { value: "A useful post" } });
	fireEvent.submit(getForm());

	await waitFor(() => {
		expect(mutateAsync).toHaveBeenCalledWith({ title: "A useful post" });
	});
	await waitFor(() => expect(titleInput).toHaveValue(""));
	expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();
});
