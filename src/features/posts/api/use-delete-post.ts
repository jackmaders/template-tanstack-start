import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ErrorHandler } from "@/lib/dispatch-error";
import { errorMeta } from "@/lib/query-client";
import { deletePostFn } from "./posts.functions";
import { postKeys } from "./posts-query-options";
import type { PostDelete } from "./posts-schema";

export function useDeletePost({
	handleError,
}: {
	handleError?: ErrorHandler;
} = {}) {
	const queryClient = useQueryClient();
	const deletePost = useServerFn(deletePostFn);

	return useMutation({
		meta: errorMeta(handleError),
		mutationFn: (data: PostDelete) => deletePost({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
