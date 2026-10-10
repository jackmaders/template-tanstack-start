import { vi } from "vitest";
import type { useDeletePost as originalUseDeletePost } from "@/features/posts/api/use-delete-post";

type DeletePostMutation = ReturnType<typeof originalUseDeletePost>["mutate"];
interface DeletePostHook {
	isPending: boolean;
	mutate: DeletePostMutation;
}

export const mutate = vi.fn<DeletePostMutation>();
export const useDeletePost = vi.fn<() => DeletePostHook>(() => ({
	isPending: false,
	mutate,
}));

export function setDeletePostPending(isPending: boolean) {
	useDeletePost.mockReturnValue({ isPending, mutate });
}

export function resetDeletePostMock() {
	mutate.mockReset();
	useDeletePost.mockReset();
	useDeletePost.mockReturnValue({ isPending: false, mutate });
}
