import { createFileRoute } from "@tanstack/react-router";
import { postsQueryOptions } from "@/features/posts/api/posts.queries";
import { PostsPage } from "@/features/posts/components/posts-page";

export const Route = createFileRoute("/")({
	component: PostsPage,
	loader: ({ context }) => context.queryClient.query(postsQueryOptions),
});
