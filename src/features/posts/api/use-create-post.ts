import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { withApplicationErrorNormalization } from "@/lib/errors";
import { createPostFn } from "./posts.functions";
import { postKeys } from "./posts-query-options";
import type { PostCreate } from "./posts-schema";

export function useCreatePost() {
	const queryClient = useQueryClient();
	const createPost = useServerFn(createPostFn);

	return useMutation({
		meta: { errorPresentation: "form" },
		mutationFn: (data: PostCreate) =>
			withApplicationErrorNormalization(() => createPost({ data })),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
	});
}
