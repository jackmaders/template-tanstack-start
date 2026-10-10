import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createPostFn } from "./posts.functions";
import { postKeys } from "./posts.queries";
import type { PostCreate } from "./posts.schema";

export function useCreatePost() {
	const queryClient = useQueryClient();
	const createPost = useServerFn(createPostFn);

	return useMutation({
		mutationFn: (data: PostCreate) => createPost({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
