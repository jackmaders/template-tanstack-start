import { fireEvent, render, screen } from "@testing-library/react";
import { useDeletePost } from "@/features/posts/api/use-delete-post";
import { DeletePostButton } from "@/features/posts/components/delete-post-button";

vi.mock("@/features/posts/api/use-delete-post");

test("deletes the post when clicked", () => {
	// Arrange
	const { mutate } = useDeletePost();

	// Act
	render(<DeletePostButton post={{ id: 1, title: "A post" }} />);

	const button = screen.getByRole("button", { name: "Delete A post" });
	fireEvent.click(button);

	// Assert
	expect(button).toHaveAttribute("type", "button");
	expect(mutate).toHaveBeenCalledOnce();
	expect(mutate).toHaveBeenCalledWith({ id: 1 });
});

test("forwards props and calls the supplied click handler", () => {
	// Arrange
	const onClick = vi.fn();

	// Act
	render(
		<DeletePostButton
			className="custom-button"
			onClick={onClick}
			post={{ id: 1, title: "A post" }}
			type="submit"
		/>,
	);

	const button = screen.getByRole("button", { name: "Delete A post" });
	fireEvent.click(button);

	// Assert
	expect(button).toHaveAttribute("type", "submit");
	expect(button).toHaveClass("custom-button");
	expect(onClick).toHaveBeenCalledOnce();
});

test("disables deletion while a mutation is pending", () => {
	// Arrange
	vi.mocked(useDeletePost).mockReturnValueOnce({
		...useDeletePost(),
		isPending: true,
	} as never);

	// Act
	render(<DeletePostButton post={{ id: 1, title: "A post" }} />);

	// Assert
	expect(screen.getByRole("button")).toBeDisabled();
});

test("respects an explicitly disabled button", () => {
	// Arrange
	const { mutate } = useDeletePost();

	// Act
	render(
		<DeletePostButton disabled={true} post={{ id: 1, title: "A post" }} />,
	);

	const button = screen.getByRole("button");
	fireEvent.click(button);

	// Assert
	expect(button).toBeDisabled();
	expect(mutate).not.toHaveBeenCalled();
});
