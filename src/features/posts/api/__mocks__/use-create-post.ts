import { vi } from "vitest";
import type { useCreatePost as originalUseCreatePost } from "@/features/posts/api/use-create-post";

type MutateAsync = ReturnType<typeof originalUseCreatePost>["mutateAsync"];

export const mutateAsync = vi.fn<MutateAsync>();
export const useCreatePost = vi.fn(() => ({ mutateAsync }));

export function resetCreatePostMock() {
	mutateAsync.mockReset();
	useCreatePost.mockReset();
	useCreatePost.mockReturnValue({ mutateAsync });
}
