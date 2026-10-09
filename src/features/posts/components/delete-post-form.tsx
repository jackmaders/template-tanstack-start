import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/db/schema/posts";
import { deletePost } from "@/features/posts/api/posts.functions";

type DeletePostFormProps = {
	post: Post;
};

export function DeletePostForm({ post }: DeletePostFormProps) {
	const router = useRouter();
	const deletePostFn = useServerFn(deletePost);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setErrorMessage(null);
			setIsSubmitting(true);

			try {
				await deletePostFn({ data: { id: post.id } });
				await router.invalidate({ sync: true });
			} catch (error) {
				setErrorMessage(
					error instanceof Error
						? error.message
						: "The post could not be deleted.",
				);
			} finally {
				setIsSubmitting(false);
			}
		},
		[deletePostFn, post.id, router],
	);

	return (
		<>
			<form onSubmit={handleSubmit}>
				<Button
					aria-label={`Delete ${post.name}`}
					disabled={isSubmitting}
					type="submit"
				>
					{isSubmitting ? "Deleting…" : "Delete"}
				</Button>
			</form>
			{errorMessage ? <p role="alert">{errorMessage}</p> : null}
		</>
	);
}
