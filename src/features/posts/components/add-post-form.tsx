import { type SubmitEvent, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { useCreatePost } from "@/features/posts/api/use-create-post";
import { createPostSchema } from "../api/posts.schema";

export function AddPostForm() {
	const { isPending, mutate: createPost, error } = useCreatePost();
	const titleInputId = useId();

	const handleSubmit = useCallback(
		(event: SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
			const form = event.currentTarget;
			const formData = Object.fromEntries(new FormData(form));
			const result = createPostSchema.safeParse(formData);

			if (!result.success) {
				console.error(result.error);
				return;
			}

			createPost(result.data, { onSuccess: () => form.reset() });
		},
		[createPost],
	);

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Add a post</CardTitle>
				</CardHeader>
				<CardContent>
					<Field>
						<FieldLabel htmlFor={titleInputId}>Post title</FieldLabel>
						<Input
							autoComplete="off"
							id={titleInputId}
							maxLength={POST_TITLE_MAX_LENGTH}
							name="title"
							placeholder="Give your post a title"
							required
						/>
						{!!error && <FieldError>{error.message}</FieldError>}
					</Field>
				</CardContent>
				<CardFooter>
					<Button disabled={isPending} type="submit">
						Add post
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
