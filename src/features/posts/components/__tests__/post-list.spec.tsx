import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { listPosts, updatePost } from "@/features/posts/api/posts-db-queries";
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

test("edits a post and refreshes its displayed title", async () => {
	// Arrange
	const user = userEvent.setup();
	const post = { id: 1, title: "A post", userId: "user-1" };
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryData(postsQueryOptions.queryKey, [post]);
	vi.mocked(updatePost).mockResolvedValueOnce({
		...post,
		title: "Updated post",
	});
	vi.mocked(listPosts).mockResolvedValueOnce([
		{ ...post, title: "Updated post" },
	]);
	queryClient.setQueryDefaults(postsQueryOptions.queryKey, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	render(<PostList />, { wrapper });

	// Act
	await user.click(screen.getByRole("button", { name: "Edit A post" }));
	const input = screen.getByRole("textbox", { name: "Post title" });
	expect(input).toHaveValue("A post");
	await user.clear(input);
	await user.type(input, "Updated post");
	await user.click(screen.getByRole("button", { name: "Save changes" }));

	// Assert
	await waitFor(() =>
		expect(screen.getByText("Updated post")).toBeInTheDocument(),
	);
	expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});

test("cancels an edit without changing the post", async () => {
	// Arrange
	const user = userEvent.setup();
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryDefaults(postsQueryOptions.queryKey, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	queryClient.setQueryData(postsQueryOptions.queryKey, [
		{ id: 1, title: "A post", userId: "user-1" },
	]);
	render(<PostList />, { wrapper });

	// Act
	await user.click(screen.getByRole("button", { name: "Edit A post" }));
	await user.type(
		screen.getByRole("textbox", { name: "Post title" }),
		" changed",
	);
	await user.click(screen.getByRole("button", { name: "Cancel" }));

	// Assert
	expect(screen.getByText("A post")).toBeInTheDocument();
	expect(updatePost).not.toHaveBeenCalled();
});

test("prevents saving a blank title", async () => {
	// Arrange
	const user = userEvent.setup();
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryDefaults(postsQueryOptions.queryKey, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	queryClient.setQueryData(postsQueryOptions.queryKey, [
		{ id: 1, title: "A post", userId: "user-1" },
	]);
	render(<PostList />, { wrapper });

	// Act
	await user.click(screen.getByRole("button", { name: "Edit A post" }));
	await user.clear(screen.getByRole("textbox", { name: "Post title" }));
	await user.type(screen.getByRole("textbox", { name: "Post title" }), "   ");

	// Assert
	expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
	expect(updatePost).not.toHaveBeenCalled();
});

test("keeps the draft and shows an error when saving fails", async () => {
	// Arrange
	const user = userEvent.setup();
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryDefaults(postsQueryOptions.queryKey, {
		staleTime: Number.POSITIVE_INFINITY,
	});
	queryClient.setQueryData(postsQueryOptions.queryKey, [
		{ id: 1, title: "A post", userId: "user-1" },
	]);
	vi.mocked(updatePost).mockRejectedValueOnce(new Error("Update failed"));
	render(<PostList />, { wrapper });

	// Act
	await user.click(screen.getByRole("button", { name: "Edit A post" }));
	await user.type(
		screen.getByRole("textbox", { name: "Post title" }),
		" changed",
	);
	await user.click(screen.getByRole("button", { name: "Save changes" }));

	// Assert
	expect(
		await screen.findByText("Something went wrong. Please try again."),
	).toBeInTheDocument();
	expect(screen.getByRole("textbox", { name: "Post title" })).toHaveValue(
		"A post changed",
	);
});
