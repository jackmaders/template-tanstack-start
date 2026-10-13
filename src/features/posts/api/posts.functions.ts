import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { createPost, deletePost, listPosts } from "./posts-db-queries";
import { createPostSchema, deletePostSchema } from "./posts-schema";

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
