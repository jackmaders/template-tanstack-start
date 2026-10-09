import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useId,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { POST_NAME_MAX_LENGTH } from "@/db/schema/posts";
import { createPost } from "@/features/posts/api/posts.functions";

export function AddPostForm() {
	const router = useRouter();
	const createPostFn = useServerFn(createPost);
	const headingId = useId();
	const titleInputId = useId();
	const [title, setTitle] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleTitleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setTitle(event.target.value);
		},
		[],
	);

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setErrorMessage(null);
			setIsSubmitting(true);

			try {
				await createPostFn({ data: { name: title } });
				setTitle("");
				await router.invalidate({ sync: true });
			} catch (error) {
				setErrorMessage(
					error instanceof Error
						? error.message
						: "The post could not be created.",
				);
			} finally {
				setIsSubmitting(false);
			}
		},
		[createPostFn, router, title],
	);

	return (
		<section aria-labelledby={headingId}>
			<h2 id={headingId}>Add a post</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor={titleInputId}>Post title</label>
				<input
					autoComplete="off"
					id={titleInputId}
					maxLength={POST_NAME_MAX_LENGTH}
					name="title"
					onChange={handleTitleChange}
					placeholder="Give your post a title"
					required
					value={title}
				/>
				<Button
					disabled={isSubmitting || title.trim().length === 0}
					type="submit"
				>
					{isSubmitting ? "Adding…" : "Add post"}
				</Button>
			</form>
			{errorMessage ? <p role="alert">{errorMessage}</p> : null}
		</section>
	);
}
