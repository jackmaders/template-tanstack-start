import { createFileRoute } from "@tanstack/react-router";
import { listPosts } from "@/features/posts/api/posts.functions";
import { PostsPage } from "@/features/posts/components/posts-page";

export const Route = createFileRoute("/")({
	loader: () => listPosts(),
	component: Home,
});

function Home() {
	const posts = Route.useLoaderData();

	return <PostsPage posts={posts} />;
}
