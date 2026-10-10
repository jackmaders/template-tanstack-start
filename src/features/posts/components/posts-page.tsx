import { AddPostForm } from "./add-post-form";
import { PostList } from "./post-list";

export function PostsPage() {
	return (
		<main>
			<header>
				<p>Your workspace</p>
				<h1>Posts</h1>
				<p>A simple place to collect ideas. Add a post to get started.</p>
			</header>

			<AddPostForm />
			<PostList />
		</main>
	);
}
