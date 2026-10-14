import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
	createPost,
	deletePost,
	listPosts,
	updatePost,
} from "./posts-db-queries";
import {
	createPostSchema,
	deletePostSchema,
	updatePostSchema,
} from "./posts-schema";

export const listPostsFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(({ context }) => listPosts(context.session.user));

export const createPostFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(createPostSchema)
	.handler(({ data, context }) => createPost(context.session.user, data));

export const deletePostFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(deletePostSchema)
	.handler(({ data, context }) => deletePost(context.session.user, data.id));

export const updatePostFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(updatePostSchema)
	.handler(({ data, context }) => updatePost(context.session.user, data));
