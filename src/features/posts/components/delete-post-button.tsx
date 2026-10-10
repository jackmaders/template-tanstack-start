import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/features/posts/api/posts.schema";
import { useDeletePost } from "@/features/posts/api/use-delete-post";

interface DeletePostButtonProps extends ComponentProps<"button"> {
	post: Post;
}

export function DeletePostButton({ post, ...props }: DeletePostButtonProps) {
	const { isPending, mutate: deletePost } = useDeletePost();

	return (
		<Button
			disabled={isPending}
			onClick={() => deletePost({ id: post.id })}
			type="button"
			{...props}
		>
			{`Delete ${post.title}`}
		</Button>
	);
}
