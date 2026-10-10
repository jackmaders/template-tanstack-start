import { vi } from "vitest";
import type {
	createPost as CreatePost,
	deletePost as DeletePost,
	listPosts as ListPosts,
} from "@/features/posts/api/posts.server";

export const createPost = vi.fn<typeof CreatePost>();
export const deletePost = vi.fn<typeof DeletePost>();
export const listPosts = vi.fn<typeof ListPosts>();
