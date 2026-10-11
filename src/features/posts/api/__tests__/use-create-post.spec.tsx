import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/features/posts/api/posts.server";
import { useCreatePost } from "@/features/posts/api/use-create-post";

vi.mock("@tanstack/react-query");
vi.mock("@tanstack/react-start");
vi.mock("@/features/posts/api/posts.server");

test("forwards new post data and returns the created post", async () => {
	// Arrange
	const data = { title: "New post" };
	const post = { id: 1, ...data };
	vi.mocked(createPost).mockResolvedValueOnce(post);

	const { mutateAsync } = useCreatePost();

	// Act
	const result = await mutateAsync(data);

	// Assert
	expect(result).toBe(post);

	expect(useMutation).toHaveBeenCalledOnce();
	expect(createPost).toHaveBeenCalledOnce();
	expect(createPost).toHaveBeenCalledWith(data);
});

test("invalidates post queries after a successful mutation", async () => {
	// Arrange
	const { invalidateQueries } = useQueryClient();
	const { mutateAsync } = useCreatePost();

	// Act
	await mutateAsync({ title: "New post" });

	// Assert
	expect(invalidateQueries).toHaveBeenCalledOnce();
	expect(invalidateQueries).toHaveBeenCalledWith({
		queryKey: ["posts"],
	});
});

test("propagates errors from creating a post", async () => {
	// Arrange
	const error = new Error("Unable to create post");
	vi.mocked(createPost).mockRejectedValueOnce(error);
	const { mutateAsync } = useCreatePost();

	// Act
	const result = mutateAsync({ title: "New post" });

	// Assert
	await expect(result).rejects.toBe(error);
});
