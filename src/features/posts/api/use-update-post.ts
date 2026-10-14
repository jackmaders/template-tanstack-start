import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { updatePostFn } from "./posts.functions";
import { postKeys } from "./posts-query-options";
import type { PostUpdate } from "./posts-schema";

export function useUpdatePost() {
	const queryClient = useQueryClient();
	const updatePost = useServerFn(updatePostFn);

	return useMutation({
		mutationFn: (data: PostUpdate) => updatePost({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
