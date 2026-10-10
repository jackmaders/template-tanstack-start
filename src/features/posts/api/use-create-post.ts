import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createPost } from "./posts.functions";
import { postKeys } from "./posts.queries";
import type { PostInsert } from "./posts.schema";

export function useCreatePost() {
	const queryClient = useQueryClient();
	const createPostFn = useServerFn(createPost);

	return useMutation({
		mutationFn: (data: PostInsert) => createPostFn({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
