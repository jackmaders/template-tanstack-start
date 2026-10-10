import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useId } from "react";
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
	const { isPending, mutate: createPost } = useCreatePost();
	const titleInputId = useId();

	const form = useForm({
		defaultValues: { title: "" },
		validationLogic: revalidateLogic(),
		validators: { onDynamic: createPostSchema },
		onSubmit: ({ value }) => {
			createPost(createPostSchema.parse(value), {
				onSuccess: () => form.reset(),
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Card>
				<CardHeader>
					<CardTitle>Add a post</CardTitle>
				</CardHeader>
				<CardContent>
					<form.Field name="title">
						{(field) => {
							const errors = field.state.meta.errors;
							const isInvalid = errors.length > 0;
							const titleErrorId = `${titleInputId}-error`;

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={titleInputId}>Post title</FieldLabel>
									<Input
										aria-describedby={isInvalid ? titleErrorId : undefined}
										aria-invalid={isInvalid}
										autoComplete="off"
										id={titleInputId}
										maxLength={POST_TITLE_MAX_LENGTH}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Give your post a title"
										value={field.state.value}
									/>
									<FieldError errors={errors} id={titleErrorId} />
								</Field>
							);
						}}
					</form.Field>
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
