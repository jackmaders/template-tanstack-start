import { fireEvent, render, screen } from "@testing-library/react";
import { useDeletePost } from "@/features/posts/api/use-delete-post";
import { DeletePostButton } from "@/features/posts/components/delete-post-button";

vi.mock("@/features/posts/api/use-delete-post");

test("deletes the post when clicked", () => {
	const { mutate } = useDeletePost();
	render(<DeletePostButton post={{ id: 1, title: "A post" }} />);

	const button = screen.getByRole("button", { name: "Delete A post" });
	fireEvent.click(button);

	expect(button).toHaveAttribute("type", "button");
	expect(mutate).toHaveBeenCalledOnce();
	expect(mutate).toHaveBeenCalledWith({ id: 1 });
});

test("forwards props and calls the supplied click handler", () => {
	const onClick = vi.fn();
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

	expect(button).toHaveAttribute("type", "submit");
	expect(button).toHaveClass("custom-button");
	expect(onClick).toHaveBeenCalledOnce();
});

test("disables deletion while a mutation is pending", () => {
	vi.mocked(useDeletePost).mockReturnValueOnce({
		...useDeletePost(),
		isPending: true,
	} as never);
	render(<DeletePostButton post={{ id: 1, title: "A post" }} />);

	expect(screen.getByRole("button")).toBeDisabled();
});

test("respects an explicitly disabled button", () => {
	const { mutate } = useDeletePost();
	render(
		<DeletePostButton disabled={true} post={{ id: 1, title: "A post" }} />,
	);

	const button = screen.getByRole("button");
	fireEvent.click(button);

	expect(button).toBeDisabled();
	expect(mutate).not.toHaveBeenCalled();
});
