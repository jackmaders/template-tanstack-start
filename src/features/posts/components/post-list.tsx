import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
