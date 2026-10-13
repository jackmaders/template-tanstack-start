import { createFileRoute } from "@tanstack/react-router";
import { postsQueryOptions } from "@/features/posts/api/posts-query-options";
import { PostsPage } from "@/features/posts/components/posts-page";

export const Route = createFileRoute("/_authenticated/posts")({
	component: PostsPage,
	loader: ({ context }) => context.queryClient.query(postsQueryOptions),
});
