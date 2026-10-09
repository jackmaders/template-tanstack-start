import { createServerFn } from "@tanstack/react-start";
import { deletePostSchema, insertPostSchema } from "./posts.schema";
import { addPost, getPosts, removePost } from "./posts.server";

export const listPosts = createServerFn({ method: "GET" }).handler(() =>
	getPosts(),
);

export const createPost = createServerFn({ method: "POST" })
	.validator(insertPostSchema)
	.handler(({ data }) => addPost(data));

export const deletePost = createServerFn({ method: "POST" })
	.validator(deletePostSchema)
	.handler(({ data }) => removePost(data.id));
