import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { withApplicationErrorNormalization } from "@/lib/errors";
import { deletePostFn } from "./posts.functions";
import { postKeys } from "./posts-query-options";
import type { PostDelete } from "./posts-schema";

export function useDeletePost() {
	const queryClient = useQueryClient();
	const deletePost = useServerFn(deletePostFn);

	return useMutation({
		mutationFn: (data: PostDelete) =>
			withApplicationErrorNormalization(() => deletePost({ data })),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
