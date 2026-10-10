import { useSuspenseQuery } from "@tanstack/react-query";
import { useId } from "react";
import { postsQueryOptions } from "@/features/posts/api/posts.queries";
import { DeletePostButton } from "./delete-post-button";

export function PostList() {
	const headingId = useId();
	const { data: posts } = useSuspenseQuery(postsQueryOptions);

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
							<p>{post.title}</p>
							<DeletePostButton post={post} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
