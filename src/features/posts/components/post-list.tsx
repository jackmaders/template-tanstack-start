import { useId } from "react";
import type { Post } from "@/db/schema/posts";
import { DeletePostForm } from "./delete-post-form";

type PostListProps = {
	posts: Post[];
};

export function PostList({ posts }: PostListProps) {
	const headingId = useId();

	return (
		<section aria-labelledby={headingId}>
			<h2 id={headingId}>All posts</h2>
			<p>
				{posts.length} {posts.length === 1 ? "post" : "posts"}
			</p>

			{posts.length === 0 ? (
				<p>No posts yet. Your new posts will show up here.</p>
			) : (
				<ul>
					{posts.map((post) => (
						<li key={post.id}>
							<p>{post.name}</p>
							<DeletePostForm post={post} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
