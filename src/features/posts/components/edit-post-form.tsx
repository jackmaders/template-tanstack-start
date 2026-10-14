import { revalidateLogic } from "@tanstack/react-form";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { useAppForm } from "@/components/forms/app-form";
import type { Form } from "@/components/forms/form";
import { Button } from "@/components/ui/button";
import { POST_TITLE_MAX_LENGTH } from "@/db/schema/posts";
import { createPostSchema, type Post } from "@/features/posts/api/posts-schema";
import { useUpdatePost } from "@/features/posts/api/use-update-post";

interface EditPostFormProps
	extends Omit<ComponentProps<typeof Form>, "children"> {
	onClose: () => void;
	post: Post;
}

export function EditPostForm({
	post,
	onClose,
	className,
	...props
}: EditPostFormProps) {
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
			<form.Form {...props} className={cn("flex gap-2", className)}>
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
