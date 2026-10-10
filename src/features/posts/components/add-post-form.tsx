import {
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useId,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { POST_NAME_MAX_LENGTH } from "@/db/schema/posts";
import { useCreatePost } from "@/features/posts/api/use-create-post";

export function AddPostForm() {
	const { isError, isPending, mutate: createPost, error } = useCreatePost();
	const headingId = useId();
	const titleInputId = useId();
	const [title, setTitle] = useState("");

	const handleTitleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setTitle(event.target.value);
		},
		[],
	);

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			createPost({ name: title }, { onSuccess: () => setTitle("") });
		},
		[createPost, title],
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
				<Button disabled={isPending || title.trim().length === 0} type="submit">
					{isPending ? "Adding…" : "Add post"}
				</Button>
			</form>
			{isError ? <p role="alert">{error.message}</p> : null}
		</section>
	);
}
