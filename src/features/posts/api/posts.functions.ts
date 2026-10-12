import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { createPost, deletePost, listPosts } from "./posts.server";
import { createPostSchema, deletePostSchema } from "./posts-schema";

export const listPostsFn = createServerFn({ method: "GET" }).handler(() =>
	listPosts(),
);

export const createPostFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(createPostSchema)
	.handler(({ data }) => createPost(data));

export const deletePostFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(deletePostSchema)
	.handler(({ data }) => deletePost(data.id));
