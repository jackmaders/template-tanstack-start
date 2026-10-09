import type { Post } from "@/db/schema/posts";
import { AddPostForm } from "./add-post-form";
import { PostList } from "./post-list";

type PostsPageProps = {
	posts: Post[];
};

export function PostsPage({ posts }: PostsPageProps) {
	return (
		<main>
			<header>
				<p>Your workspace</p>
				<h1>Posts</h1>
				<p>A simple place to collect ideas. Add a post to get started.</p>
			</header>

			<AddPostForm />
			<PostList posts={posts} />
		</main>
	);
}
