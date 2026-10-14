import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { postsQueryOptions } from "@/features/posts/api/posts-query-options";
import type { Post } from "@/features/posts/api/posts-schema";
import { useSessionStatus } from "@/lib/auth/use-session-status";
import { DeletePostButton } from "./delete-post-button";
import { EditPostForm } from "./edit-post-form";

export function PostList() {
	const { data: session, error, isPending, retrySession } = useSessionStatus();

	if (isPending) {
		return <p role="status">Checking your sign-in status…</p>;
	}

	if (error) {
		return (
			<div role="alert">
				<p>Unable to check your sign-in status.</p>
				<Button onClick={retrySession} type="button" variant="outline">
					Try again
				</Button>
			</div>
		);
	}

	if (!session) {
		return <p>Sign in to create and view your posts.</p>;
	}

	return <AuthenticatedPostList />;
}

function AuthenticatedPostList() {
	const {
		data: posts,
		error,
		isFetching,
		refetch,
	} = useSuspenseQuery(postsQueryOptions);
	const retryPosts = useCallback(() => refetch(), [refetch]);

	return (
		<section aria-label="Your posts">
			<h2>Your posts</h2>
			<p>
				{posts.length} {posts.length === 1 ? "post" : "posts"}
			</p>
			{error && !isFetching && (
				<div role="status">
					<p>Couldn't refresh posts. Showing the last loaded results.</p>
					<Button onClick={retryPosts} type="button" variant="outline">
						Retry
					</Button>
				</div>
			)}

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
	const [expanded, setExpanded] = useState<number[]>([]);
	const stopEditing = useCallback(() => setExpanded([]), []);
	return (
		<li>
			<Accordion onValueChange={setExpanded} value={expanded}>
				<AccordionItem value={post.id}>
					<div className="flex items-center gap-2">
						<p>{post.title}</p>
						<AccordionTrigger aria-label={`Edit ${post.title}`}>
							Edit
						</AccordionTrigger>
						<DeletePostButton post={post} />
					</div>
					<AccordionContent>
						{expanded.includes(post.id) && (
							<EditPostForm onClose={stopEditing} post={post} />
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</li>
	);
}
