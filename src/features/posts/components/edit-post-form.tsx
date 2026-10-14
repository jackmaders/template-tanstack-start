import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/components/forms/app-form";
import { Button } from "@/components/ui/button";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { createPostSchema, type Post } from "@/features/posts/api/posts-schema";
import { useUpdatePost } from "@/features/posts/api/use-update-post";

export function EditPostForm({
	post,
	onClose,
}: {
	post: Post;
	onClose: () => void;
}) {
	const { mutateAsync: updatePost, isPending } = useUpdatePost();
	const form = useAppForm({
		defaultValues: { title: post.title },
		onSubmit: async ({ value }) => {
			await updatePost({ id: post.id, ...value });
			onClose();
		},
		validationLogic: revalidateLogic({ mode: "change" }),
		validators: { onDynamic: createPostSchema, onMount: createPostSchema },
	});
	return (
		<form.AppForm>
			<form.Form className="flex gap-2">
				<form.AppField name="title">
					{(field) => (
						<field.TextField
							autoComplete="off"
							disabled={isPending}
							label="Post title"
							maxLength={POST_TITLE_MAX_LENGTH}
						/>
					)}
				</form.AppField>
				<form.FormError />
				<form.SubmitButton type="submit">Save changes</form.SubmitButton>
				<Button disabled={isPending} onClick={onClose} type="button">
					Cancel
				</Button>
			</form.Form>
		</form.AppForm>
	);
}
