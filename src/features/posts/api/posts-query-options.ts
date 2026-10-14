import { queryOptions } from "@tanstack/react-query";
import { withApplicationErrorNormalization } from "@/lib/errors";
import { listPostsFn } from "./posts.functions";

export const postKeys = {
	all: ["posts"] as const,
};

export const postsQueryOptions = queryOptions({
	queryFn: () => withApplicationErrorNormalization(() => listPostsFn()),
	queryKey: postKeys.all,
});
