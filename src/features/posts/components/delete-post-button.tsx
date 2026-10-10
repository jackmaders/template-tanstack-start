import { type ComponentProps, type MouseEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/features/posts/api/posts.schema";
import { useDeletePost } from "@/features/posts/api/use-delete-post";

interface DeletePostButtonProps extends ComponentProps<"button"> {
	post: Post;
}

export function DeletePostButton({
	post,
	disabled,
	onClick,
	type = "button",
	...props
}: DeletePostButtonProps) {
	const { isPending, mutate: deletePost } = useDeletePost();

	const handleOnClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			deletePost({ id: post.id });
			onClick?.(event);
		},
		[deletePost, onClick, post],
	);

	return (
		<Button
			{...props}
			disabled={disabled || isPending}
			onClick={handleOnClick}
			type={type}
		>
			{`Delete ${post.title}`}
		</Button>
	);
}
