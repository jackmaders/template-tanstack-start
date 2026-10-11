import { useSuspenseQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { postsQueryOptions } from "../../api/posts.queries";
import { PostList } from "../post-list";

vi.mock("@tanstack/react-query");
vi.mock("@tanstack/react-start");
vi.mock("../../api/posts.server");
vi.mock("../../api/use-delete-post");

test("shows an empty state when there are no posts", () => {
	vi.mocked(useSuspenseQuery).mockReturnValueOnce({ data: [] } as never);

	render(<PostList />);

	expect(useSuspenseQuery).toHaveBeenCalledWith(postsQueryOptions);
	expect(screen.getByRole("region", { name: "All posts" })).toBeInTheDocument();
	expect(screen.getByText("0 posts")).toBeInTheDocument();
	expect(
		screen.getByText("No posts yet. Your new posts will show up here."),
	).toBeInTheDocument();
	expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("shows a single post with its delete button", () => {
	vi.mocked(useSuspenseQuery).mockReturnValueOnce({
		data: [{ id: 1, title: "A post" }],
	} as never);

	render(<PostList />);

	expect(screen.getByText("1 post")).toBeInTheDocument();
	expect(screen.getByText("A post")).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: "Delete A post" }),
	).toBeInTheDocument();
});

test("shows multiple posts", () => {
	vi.mocked(useSuspenseQuery).mockReturnValueOnce({
		data: [
			{ id: 1, title: "First post" },
			{ id: 2, title: "Second post" },
		],
	} as never);

	render(<PostList />);

	expect(screen.getByText("2 posts")).toBeInTheDocument();
	expect(screen.getAllByRole("listitem")).toHaveLength(2);
	expect(screen.getByText("First post")).toBeInTheDocument();
	expect(screen.getByText("Second post")).toBeInTheDocument();
});
