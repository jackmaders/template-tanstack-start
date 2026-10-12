import { createFileRoute, redirect } from "@tanstack/react-router";
import { postsQueryOptions } from "@/features/posts/api/posts-queries";
import { PostsPage } from "@/features/posts/components/posts-page";
import { getSession } from "@/lib/auth/auth.functions";

export const Route = createFileRoute("/posts")({
	beforeLoad: async () => {
		const session = await getSession();

		if (!session) {
			throw redirect({ to: "/" });
		}
	},
	component: PostsPage,
	loader: ({ context }) => context.queryClient.query(postsQueryOptions),
});
