import { render, screen } from "@testing-library/react";
import { postsQueryOptions } from "@/features/posts/api/posts-query-options";
import { PostList } from "@/features/posts/components/post-list";
import { useSession } from "@/lib/auth/auth-client";
import { createQueryTestContext } from "@/testing/wrappers/query-client";

vi.mock("@tanstack/react-start");
vi.mock("@/lib/auth/session.server");
vi.mock("@/features/posts/api/posts-db-queries");
vi.mock("@/features/posts/api/use-delete-post");

vi.mock("@/lib/auth/auth-client");
test("shows an empty state when there are no posts", () => {
	// Arrange
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryDefaults(postsQueryOptions.queryKey, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	queryClient.setQueryData(postsQueryOptions.queryKey, []);

	// Act
	render(<PostList />, { wrapper });

	// Assert
	expect(
		screen.getByRole("region", { name: "Your posts" }),
	).toBeInTheDocument();
	expect(screen.getByText("0 posts")).toBeInTheDocument();
	expect(
		screen.getByText("No posts yet. Your new posts will show up here."),
	).toBeInTheDocument();
	expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("shows a single post with its delete button", () => {
	// Arrange
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryDefaults(postsQueryOptions.queryKey, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	queryClient.setQueryData(postsQueryOptions.queryKey, [
		{ id: 1, title: "A post", userId: "user-1" },
	]);

	// Act
	render(<PostList />, { wrapper });

	// Assert
	expect(screen.getByText("1 post")).toBeInTheDocument();
	expect(screen.getByText("A post")).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: "Delete A post" }),
	).toBeInTheDocument();
});

test("shows multiple posts", () => {
	// Arrange
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryDefaults(postsQueryOptions.queryKey, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	queryClient.setQueryData(postsQueryOptions.queryKey, [
		{ id: 1, title: "First post", userId: "user-1" },
		{ id: 2, title: "Second post", userId: "user-1" },
	]);

	// Act
	render(<PostList />, { wrapper });

	// Assert
	expect(screen.getByText("2 posts")).toBeInTheDocument();
	expect(screen.getAllByRole("listitem")).toHaveLength(2);
	expect(screen.getByText("First post")).toBeInTheDocument();
	expect(screen.getByText("Second post")).toBeInTheDocument();
});

test("asks anonymous users to sign in without loading posts", () => {
	// Arrange
	vi.mocked(useSession).mockReturnValueOnce({
		data: null,
		error: null,
		isPending: false,
		isRefetching: false,
		refetch: vi.fn(),
	} as ReturnType<typeof useSession>);

	// Act
	render(<PostList />);

	// Assert
	expect(
		screen.getByText("Sign in to create and view your posts."),
	).toBeInTheDocument();
});
