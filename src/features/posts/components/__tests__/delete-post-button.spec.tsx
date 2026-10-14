import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it } from "vitest";
import { useDeletePost } from "@/features/posts/api/use-delete-post";
import { DeletePostButton } from "@/features/posts/components/delete-post-button";
import { createPostFixture } from "@/testing/fixtures/post";

vi.mock("@/features/posts/api/use-delete-post");

it("deletes the post when clicked", async () => {
	// Arrange
	const user = userEvent.setup();
	const { mutate } = useDeletePost();

	// Act
	render(<DeletePostButton post={createPostFixture()} />);

	const button = screen.getByRole("button", { name: "Delete A post" });
	await user.click(button);

	// Assert
	expect(button).toHaveAttribute("type", "button");
	expect(mutate).toHaveBeenCalledOnce();
	expect(mutate).toHaveBeenCalledWith({ id: 1 });
});

it("forwards props and calls the supplied click handler", async () => {
	// Arrange
	const user = userEvent.setup();
	const onClick = vi.fn();

	// Act
	render(
		<DeletePostButton
			className="custom-button"
			onClick={onClick}
			post={createPostFixture()}
			type="submit"
		/>,
	);

	const button = screen.getByRole("button", { name: "Delete A post" });
	await user.click(button);

	// Assert
	expect(button).toHaveAttribute("type", "submit");
	expect(button).toHaveClass("custom-button");
	expect(onClick).toHaveBeenCalledOnce();
});

it("disables deletion while a mutation is pending", () => {
	// Arrange
	vi.mocked(useDeletePost, { partial: true }).mockReturnValueOnce({
		isPending: true,
		mutate: useDeletePost().mutate,
	});

	// Act
	render(<DeletePostButton post={createPostFixture()} />);

	// Assert
	expect(screen.getByRole("button")).toBeDisabled();
});

it("respects an explicitly disabled button", async () => {
	// Arrange
	const user = userEvent.setup();
	const { mutate } = useDeletePost();

	// Act
	render(<DeletePostButton disabled={true} post={createPostFixture()} />);

	const button = screen.getByRole("button");
	await user.click(button);

	// Assert
	expect(button).toBeDisabled();
	expect(mutate).not.toHaveBeenCalled();
});
