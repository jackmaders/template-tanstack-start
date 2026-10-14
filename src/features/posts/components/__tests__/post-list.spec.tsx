import { toast } from "@/components/ui/toast-manager";
import { PostNotFoundError } from "@/lib/errors";

vi.mock("@/components/ui/toast-manager");

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
	vi.mocked(updatePost).mockRejectedValueOnce(new PostNotFoundError());
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
		await screen.findByText("This post is no longer available."),
	).toBeInTheDocument();
	expect(screen.getByRole("textbox", { name: "Post title" })).toHaveValue(
		"A post changed",
	);
	expect(toast.add).not.toHaveBeenCalled();
});

test("shows cached posts and inline recovery after a failed background refresh", async () => {
	// Arrange
	const post = { id: 1, title: "Cached post", userId: "user-1" };
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryData(postsQueryOptions.queryKey, [post], {
		updatedAt: 1,
	});
	vi.mocked(listPosts).mockRejectedValueOnce(new Error("private SQL failure"));

	// Act
	render(<PostList />, { wrapper });

	// Assert
	expect(
		await screen.findByText(
			"Couldn't refresh posts. Showing the last loaded results.",
		),
	).toBeVisible();
	expect(screen.getByText("Cached post")).toBeVisible();
	expect(queryClient.getQueryData(postsQueryOptions.queryKey)).toEqual([post]);
	expect(toast.add).not.toHaveBeenCalled();
});

test("shows pending session status before fetching posts", () => {
	// Arrange
	const session = useSession();
	vi.mocked(useSession).mockReturnValueOnce({ ...session, isPending: true });

	// Act
	render(<PostList />);

	// Assert
	expect(screen.getByRole("status")).toHaveTextContent(
		"Checking your sign-in status…",
	);
	expect(listPosts).not.toHaveBeenCalled();
});

test("keeps session failures inline and allows a retry", async () => {
	// Arrange
	const user = userEvent.setup();
	const session = useSession();
	const refetch = vi.fn().mockResolvedValueOnce(undefined);
	vi.mocked(useSession).mockReturnValueOnce({
		...session,
		error: {
			error: {},
			message: "provider details",
			name: "BetterFetchError",
			status: 500,
			statusText: "Server Error",
		},
		refetch,
	});

	// Act
	render(<PostList />);
	await user.click(screen.getByRole("button", { name: "Try again" }));

	// Assert
	expect(screen.getByRole("alert")).toHaveTextContent(
		"Unable to check your sign-in status.",
	);
	expect(refetch).toHaveBeenCalledOnce();
	expect(toast.add).not.toHaveBeenCalled();
});

test("recovers from a failed refresh using the inline retry control", async () => {
	// Arrange
	const user = userEvent.setup();
	const post = { id: 1, title: "Cached post", userId: "user-1" };
	const refreshed = { ...post, title: "Refreshed post" };
	const { queryClient, wrapper } = createQueryTestContext();
	queryClient.setQueryData(postsQueryOptions.queryKey, [post], {
		updatedAt: 1,
	});
	vi.mocked(listPosts)
		.mockRejectedValueOnce(new Error("refresh failed"))
		.mockResolvedValueOnce([refreshed]);
	render(<PostList />, { wrapper });
	await screen.findByText(
		"Couldn't refresh posts. Showing the last loaded results.",
	);

	// Act
	await user.click(screen.getByRole("button", { name: "Retry" }));

	// Assert
	expect(await screen.findByText("Refreshed post")).toBeVisible();
	expect(
		screen.queryByText(
			"Couldn't refresh posts. Showing the last loaded results.",
		),
	).not.toBeInTheDocument();
	expect(toast.add).not.toHaveBeenCalled();
});
