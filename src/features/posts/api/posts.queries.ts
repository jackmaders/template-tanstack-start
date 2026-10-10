import { queryOptions } from "@tanstack/react-query";
import { listPostsFn } from "./posts.functions";

export const postKeys = {
	all: ["posts"] as const,
};

export const postsQueryOptions = queryOptions({
	queryKey: postKeys.all,
	queryFn: () => listPostsFn(),
});
