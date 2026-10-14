import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ErrorHandler } from "@/lib/dispatch-error";
import { errorMeta } from "@/lib/query-client";
import { updatePostFn } from "./posts.functions";
import { postKeys } from "./posts-query-options";
import type { PostUpdate } from "./posts-schema";

export function useUpdatePost({
	handleError,
}: {
	handleError?: ErrorHandler;
} = {}) {
	const queryClient = useQueryClient();
	const updatePost = useServerFn(updatePostFn);

	return useMutation({
		meta: errorMeta(handleError),
		mutationFn: (data: PostUpdate) => updatePost({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
