import type { posts } from "@/db/schema/posts";

type Post = typeof posts.$inferSelect;

export function createPostFixture(overrides: Partial<Post> = {}): Post {
	return { id: 1, title: "A post", ...overrides };
}
