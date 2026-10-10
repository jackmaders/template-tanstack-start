import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deletePost } from "./posts.functions";
import { postKeys } from "./posts.queries";
import type { PostDelete } from "./posts.schema";

export function useDeletePost() {
	const queryClient = useQueryClient();
	const deletePostFn = useServerFn(deletePost);

	return useMutation({
		mutationFn: (data: PostDelete) => deletePostFn({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
