import { type SubmitEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/features/posts/api/posts.schema";
import { useDeletePost } from "@/features/posts/api/use-delete-post";

type DeletePostFormProps = {
	post: Post;
};

export function DeletePostForm({ post }: DeletePostFormProps) {
	const { isError, isPending, mutate: deletePost, error } = useDeletePost();

	const handleSubmit = useCallback(
		(event: SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
			deletePost({ id: post.id });
		},
		[deletePost, post.id],
	);

	return (
		<>
			<form onSubmit={handleSubmit}>
				<Button
					aria-label={`Delete ${post.title}`}
					disabled={isPending}
					type="submit"
				>
					{isPending ? "Deleting…" : "Delete"}
				</Button>
			</form>
			{isError ? <p role="alert">{error.message}</p> : null}
		</>
	);
}
