import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "@/features/posts/api/posts-queries";
import { useSession } from "@/lib/auth/auth-client";
import { DeletePostButton } from "./delete-post-button";

export function PostList() {
	const { data: session } = useSession();

	if (!session) {
		return <p>Sign in to create and view your posts.</p>;
	}

	return <AuthenticatedPostList />;
}

function AuthenticatedPostList() {
	const { data: posts } = useSuspenseQuery(postsQueryOptions);

	return (
		<section aria-label="Your posts">
			<h2>Your posts</h2>
			<p>
				{posts.length} {posts.length === 1 ? "post" : "posts"}
			</p>

			{posts.length === 0 ? (
				<p>No posts yet. Your new posts will show up here.</p>
			) : (
				<ul>
					{posts.map((post) => (
						<li className="flex gap-2" key={post.id}>
							<p>{post.title}</p>
							<DeletePostButton post={post} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
