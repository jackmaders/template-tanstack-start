import type { ComponentProps } from "react";
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

	return (
		<Button
			{...props}
			disabled={disabled || isPending}
			onClick={(e) => {
				deletePost({ id: post.id });
				onClick?.(e);
			}}
			type={type}
		>
			{`Delete ${post.title}`}
		</Button>
	);
}
