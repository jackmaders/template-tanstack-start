import { fireEvent, render, screen } from "@testing-library/react";
import {
	mutate,
	resetDeletePostMock,
	setDeletePostPending,
} from "@/features/posts/api/__mocks__/use-delete-post";
import type { Post } from "@/features/posts/api/posts.schema";
import { DeletePostButton } from "../delete-post-button";

vi.mock("@/features/posts/api/use-delete-post");

const post: Post = { id: 17, title: "A post to remove" };

beforeEach(() => resetDeletePostMock());

test("renders a delete button and calls the mutation and click handler", () => {
	const onClick = vi.fn();
	render(
		<DeletePostButton
			data-testid="delete-post"
			onClick={onClick}
			post={post}
		/>,
	);

	const button = screen.getByRole("button", {
		name: "Delete A post to remove",
	});
	expect(button).toHaveAttribute("type", "button");
	expect(button).toHaveAttribute("data-testid", "delete-post");
	expect(button).toBeEnabled();

	fireEvent.click(button);

	expect(mutate).toHaveBeenCalledWith({ id: post.id });
	expect(onClick).toHaveBeenCalledOnce();
});

test("disables the button when the disabled prop is true", () => {
	render(<DeletePostButton disabled={true} post={post} />);

	const button = screen.getByRole("button", {
		name: "Delete A post to remove",
	});
	expect(button).toBeDisabled();

	fireEvent.click(button);

	expect(mutate).not.toHaveBeenCalled();
});

test("disables the button while a deletion is pending and forwards the type", () => {
	setDeletePostPending(true);
	render(<DeletePostButton post={post} type="submit" />);

	const button = screen.getByRole("button", {
		name: "Delete A post to remove",
	});
	expect(button).toHaveAttribute("type", "submit");
	expect(button).toBeDisabled();

	fireEvent.click(button);

	expect(mutate).not.toHaveBeenCalled();
});

test("deletes the post when clicked without an optional click handler", () => {
	render(<DeletePostButton post={post} />);

	fireEvent.click(
		screen.getByRole("button", { name: "Delete A post to remove" }),
	);

	expect(mutate).toHaveBeenCalledWith({ id: post.id });
});
