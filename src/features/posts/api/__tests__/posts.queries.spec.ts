import { vi } from "vitest";
import {
	postKeys,
	postsQueryOptions,
} from "@/features/posts/api/posts.queries";
import { listPosts } from "@/features/posts/api/posts.server";

vi.mock("@/features/posts/api/posts.server");
vi.mock("@tanstack/react-start");

test("postsQueryOptions uses the posts key", () => {
	expect(postsQueryOptions.queryKey).toEqual(postKeys.all);
	expect(postKeys.all).toEqual(["posts"]);
});

test("postsQueryOptions returns posts from the query function", async () => {
	const posts = [{ id: 1, title: "A post" }];
	vi.mocked(listPosts).mockResolvedValueOnce(posts);

	await expect(postsQueryOptions.queryFn({} as never)).resolves.toEqual(posts);
	expect(listPosts).toHaveBeenCalledOnce();
});
