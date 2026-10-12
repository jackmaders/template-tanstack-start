import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "@/lib/auth/auth.functions";
import { createPost, deletePost, listPosts } from "./posts.server";
import { createPostSchema, deletePostSchema } from "./posts-schema";

export const listPostsFn = createServerFn({ method: "GET" }).handler(() =>
	listPosts(),
);

export const createPostFn = createServerFn({ method: "POST" })
	.validator(createPostSchema)
	.handler(async ({ data }) => {
		await ensureSession();
		return createPost(data);
	});

export const deletePostFn = createServerFn({ method: "POST" })
	.validator(deletePostSchema)
	.handler(async ({ data }) => {
		await ensureSession();
		return deletePost(data.id);
	});
