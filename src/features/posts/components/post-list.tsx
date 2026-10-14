import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { postsQueryOptions } from "@/features/posts/api/posts-query-options";
import type { Post } from "@/features/posts/api/posts-schema";
import { useSession } from "@/lib/auth/auth-client";
import { DeletePostButton } from "./delete-post-button";
import { EditPostForm } from "./edit-post-form";

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
						<PostListItem key={post.id} post={post} />
					))}
				</ul>
			)}
		</section>
	);
}

function PostListItem({ post }: { post: Post }) {
	const [isEditing, setIsEditing] = useState(false);
	const startEditing = useCallback(() => setIsEditing(true), []);
	const stopEditing = useCallback(() => setIsEditing(false), []);
	return (
		<li className="flex gap-2">
			{isEditing ? (
				<EditPostForm onClose={stopEditing} post={post} />
			) : (
				<>
					<p>{post.title}</p>
					<Button
						onClick={startEditing}
						type="button"
					>{`Edit ${post.title}`}</Button>
					<DeletePostButton post={post} />
				</>
			)}
		</li>
	);
}
