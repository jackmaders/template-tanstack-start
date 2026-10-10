import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deletePostFn } from "./posts.functions";
import { postKeys } from "./posts.queries";
import type { PostDelete } from "./posts.schema";

export function useDeletePost() {
	const queryClient = useQueryClient();
	const deletePost = useServerFn(deletePostFn);

	return useMutation({
		mutationFn: (data: PostDelete) => deletePost({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
