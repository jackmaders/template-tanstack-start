import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/components/forms/app-form";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { useCreatePost } from "@/features/posts/api/use-create-post";
import { createPostSchema } from "../api/posts.schema";

export function AddPostForm() {
	const { isPending, mutate: createPost } = useCreatePost();

	const form = useAppForm({
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
		<form.AppForm>
			<form.Form>
				<Card>
					<CardHeader>
						<CardTitle>Add a post</CardTitle>
					</CardHeader>
					<CardContent>
						<form.AppField name="title">
							{(field) => (
								<field.TextField
									autoComplete="off"
									label="Post title"
									maxLength={POST_TITLE_MAX_LENGTH}
									placeholder="Give your post a title"
								/>
							)}
						</form.AppField>
					</CardContent>
					<CardFooter>
						<form.SubmitButton disabled={isPending} type="submit">
							Add post
						</form.SubmitButton>
					</CardFooter>
				</Card>
			</form.Form>
		</form.AppForm>
	);
}
