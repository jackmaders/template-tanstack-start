import { AddPostForm } from "./add-post-form";
import { PostList } from "./post-list";

export function PostsPage() {
	return (
		<main>
			<header>
				<h1>Welcome to TanStack Start</h1>
			</header>

			<AddPostForm />
			<PostList />
		</main>
	);
}
