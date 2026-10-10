import { useSuspenseQuery } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import { resetDeletePostMock } from "@/features/posts/api/__mocks__/use-delete-post";
import type { Post } from "@/features/posts/api/posts.schema";
import { PostList } from "../post-list";

vi.mock("@tanstack/react-query");
vi.mock("@/features/posts/api/use-delete-post");
vi.mock("@/features/posts/api/posts.server");
vi.mock("@tanstack/react-start");

function renderPostList(posts: Post[]) {
	vi.mocked(useSuspenseQuery).mockReturnValue({ data: posts } as never);
	return render(<PostList />);
}

beforeEach(() => resetDeletePostMock());

test("renders the empty state when there are no posts", () => {
	renderPostList([]);

	expect(
		screen.getByRole("heading", { name: "All posts" }),
	).toBeInTheDocument();
	expect(screen.getByText("0 posts")).toBeInTheDocument();
	expect(
		screen.getByText("No posts yet. Your new posts will show up here."),
	).toBeInTheDocument();
	expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("renders one post with the singular count", () => {
	const posts: Post[] = [{ id: 1, title: "First post" }];
	renderPostList(posts);

	expect(screen.getByText("1 post")).toBeInTheDocument();
	const list = screen.getByRole("list");
	expect(within(list).getAllByRole("listitem")).toHaveLength(1);
	expect(within(list).getByText("First post")).toBeInTheDocument();
	expect(
		within(list).getByRole("button", { name: "Delete First post" }),
	).toBeInTheDocument();
	expect(
		screen.queryByText("No posts yet. Your new posts will show up here."),
	).not.toBeInTheDocument();
});

test("renders multiple posts with the plural count", () => {
	const posts: Post[] = [
		{ id: 1, title: "First post" },
		{ id: 2, title: "Second post" },
	];
	renderPostList(posts);

	expect(screen.getByText("2 posts")).toBeInTheDocument();
	const list = screen.getByRole("list");
	expect(within(list).getAllByRole("listitem")).toHaveLength(2);
	for (const post of posts) {
		expect(within(list).getByText(post.title)).toBeInTheDocument();
		expect(
			within(list).getByRole("button", { name: `Delete ${post.title}` }),
		).toBeInTheDocument();
	}
});
