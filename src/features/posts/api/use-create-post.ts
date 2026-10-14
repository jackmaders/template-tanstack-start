import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ErrorHandler } from "@/lib/dispatch-error";
import { errorMeta } from "@/lib/query-client";
import { createPostFn } from "./posts.functions";
import { postKeys } from "./posts-query-options";
import type { PostCreate } from "./posts-schema";

export function useCreatePost({
	handleError,
}: {
	handleError?: ErrorHandler;
} = {}) {
	const queryClient = useQueryClient();
	const createPost = useServerFn(createPostFn);

	return useMutation({
		meta: errorMeta(handleError),
		mutationFn: (data: PostCreate) => createPost({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
