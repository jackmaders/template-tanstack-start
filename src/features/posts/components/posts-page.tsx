import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useId,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { POST_NAME_MAX_LENGTH, type Post } from "@/db/schema/posts";
import { createPost, deletePost } from "@/features/posts/api/posts.functions";

type PostsPageProps = {
	posts: Post[];
};

export function PostsPage({ posts }: PostsPageProps) {
	const router = useRouter();
	const createPostFn = useServerFn(createPost);
	const deletePostFn = useServerFn(deletePost);
	const addPostHeadingId = useId();
	const postTitleInputId = useId();
	const postListHeadingId = useId();
	const [title, setTitle] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleTitleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setTitle(event.target.value);
		},
		[],
	);

	const handleCreate = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setErrorMessage(null);
			setIsCreating(true);

			try {
				await createPostFn({ data: { name: title } });
				setTitle("");
				await router.invalidate({ sync: true });
			} catch (error) {
				setErrorMessage(
					error instanceof Error
						? error.message
						: "The post could not be created.",
				);
			} finally {
				setIsCreating(false);
			}
		},
		[createPostFn, router, title],
	);

	const handleDelete = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const formData = new FormData(event.currentTarget);
			const postId = Number(formData.get("postId"));
			const post = posts.find((item) => item.id === postId);

			if (!post) {
				setErrorMessage("Choose a valid post to delete.");
				return;
			}

			setErrorMessage(null);
			setDeletingPostId(post.id);

			try {
				await deletePostFn({ data: { id: post.id } });
				await router.invalidate({ sync: true });
			} catch (error) {
				setErrorMessage(
					error instanceof Error
						? error.message
						: "The post could not be deleted.",
				);
			} finally {
				setDeletingPostId(null);
			}
		},
		[deletePostFn, posts, router],
	);

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16 sm:px-8 sm:py-24">
			<header className="mb-10">
				<p className="mb-3 font-medium text-muted-foreground text-sm uppercase tracking-wide">
					Your workspace
				</p>
				<h1 className="font-semibold text-4xl tracking-tight sm:text-5xl">
					Posts
				</h1>
				<p className="mt-3 max-w-xl text-base text-muted-foreground leading-7">
					A simple place to collect ideas. Add a post to get started.
				</p>
			</header>

			<section
				aria-labelledby={addPostHeadingId}
				className="rounded-xl border bg-card p-5 shadow-sm sm:p-6"
			>
				<h2 className="font-semibold text-lg" id={addPostHeadingId}>
					Add a post
				</h2>
				<form
					className="mt-4 flex flex-col gap-3 sm:flex-row"
					onSubmit={handleCreate}
				>
					<div className="min-w-0 flex-1">
						<label className="sr-only" htmlFor={postTitleInputId}>
							Post title
						</label>
						<input
							autoComplete="off"
							className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
							id={postTitleInputId}
							maxLength={POST_NAME_MAX_LENGTH}
							name="title"
							onChange={handleTitleChange}
							placeholder="Give your post a title"
							required
							value={title}
						/>
					</div>
					<Button
						disabled={isCreating || title.trim().length === 0}
						type="submit"
					>
						{isCreating ? "Adding…" : "Add post"}
					</Button>
				</form>
			</section>

			<section aria-labelledby={postListHeadingId} className="mt-10">
				<div className="mb-4 flex items-baseline justify-between gap-4">
					<h2 className="font-semibold text-lg" id={postListHeadingId}>
						All posts
					</h2>
					<span className="text-muted-foreground text-sm">
						{posts.length} {posts.length === 1 ? "post" : "posts"}
					</span>
				</div>

				{errorMessage ? (
					<p
						className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm"
						role="alert"
					>
						{errorMessage}
					</p>
				) : null}

				{posts.length === 0 ? (
					<div className="rounded-xl border border-dashed px-6 py-12 text-center">
						<p className="font-medium">No posts yet</p>
						<p className="mt-1 text-muted-foreground text-sm">
							Your new posts will show up here.
						</p>
					</div>
				) : (
					<ul className="divide-y rounded-xl border bg-card">
						{posts.map((post) => (
							<li
								className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5"
								key={post.id}
							>
								<p className="min-w-0 break-words font-medium">{post.name}</p>
								<form onSubmit={handleDelete}>
									<input name="postId" type="hidden" value={post.id} />
									<Button
										aria-label={`Delete ${post.name}`}
										disabled={deletingPostId !== null}
										type="submit"
										variant="ghost"
									>
										{deletingPostId === post.id ? "Deleting…" : "Delete"}
									</Button>
								</form>
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}
