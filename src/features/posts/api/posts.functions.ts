import { createServerFn } from "@tanstack/react-start";
import { createPostSchema, deletePostSchema } from "./posts.schema";
import { createPost, deletePost, listPosts } from "./posts.server";

export const listPostsFn = createServerFn({ method: "GET" }).handler(() =>
	listPosts(),
);

export const createPostFn = createServerFn({ method: "POST" })
	.validator(createPostSchema)
	.handler(({ data }) => createPost(data));

export const deletePostFn = createServerFn({ method: "POST" })
	.validator(deletePostSchema)
	.handler(({ data }) => deletePost(data.id));
