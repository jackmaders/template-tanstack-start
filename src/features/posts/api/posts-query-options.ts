import { queryOptions } from "@tanstack/react-query";
import { errorMeta } from "@/lib/query-client";
import { listPostsFn } from "./posts.functions";

export const postKeys = {
	all: ["posts"] as const,
};

export const postsQueryOptions = queryOptions({
	// Initial failures use the route fallback; refresh failures render inline.
	meta: errorMeta(() => true),
	queryFn: () => listPostsFn(),
	queryKey: postKeys.all,
});
