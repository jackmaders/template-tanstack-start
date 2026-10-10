import { vi } from "vitest";
import { getDb } from "@/db/db.server";
import type { Post } from "@/features/posts/api/posts.schema";
import {
	createPost,
	deletePost,
	listPosts,
} from "@/features/posts/api/posts.server";

vi.mock("@/db/db.server");

interface MockDatabaseResults {
	createdPosts?: Post[];
	deletedPosts?: Post[];
	listedPosts?: Post[];
}

function hasPostDatabaseOperations(
	value: unknown,
): value is ReturnType<typeof getDb> {
	return (
		typeof value === "object" &&
		value !== null &&
		typeof Reflect.get(value, "select") === "function" &&
		typeof Reflect.get(value, "insert") === "function" &&
		typeof Reflect.get(value, "delete") === "function"
	);
}

function makeMockDatabase(results: MockDatabaseResults = {}) {
	const limit = vi.fn().mockResolvedValue(results.listedPosts ?? []);
	const orderBy = vi.fn(() => ({ limit }));
	const from = vi.fn(() => ({ orderBy }));
	const select = vi.fn(() => ({ from }));

	const createReturning = vi.fn().mockResolvedValue(results.createdPosts ?? []);
	const values = vi.fn(() => ({ returning: createReturning }));
	const insert = vi.fn(() => ({ values }));

	const deleteReturning = vi.fn().mockResolvedValue(results.deletedPosts ?? []);
	const where = vi.fn(() => ({ returning: deleteReturning }));
	const deleteQuery = vi.fn(() => ({ where }));

	const db = {
		delete: deleteQuery,
		insert,
		select,
	};
	if (!hasPostDatabaseOperations(db)) {
		throw new Error("The mock database is missing post operations");
	}

	return {
		calls: {
			createReturning,
			deleteQuery,
			deleteReturning,
			from,
			insert,
			limit,
			orderBy,
			select,
			values,
			where,
		},
		db,
	};
}

test("listPosts queries the posts table in descending id order with a 50 row limit", async () => {
	const listedPosts = [
		{ id: 5, title: "Newest post" },
		{ id: 4, title: "Older post" },
	];
	const { db, calls } = makeMockDatabase({ listedPosts });
	vi.mocked(getDb).mockReturnValue(db);

	await expect(listPosts()).resolves.toEqual(listedPosts);

	expect(calls.select).toHaveBeenCalledOnce();
	expect(calls.from).toHaveBeenCalledOnce();
	expect(calls.orderBy).toHaveBeenCalledOnce();
	expect(calls.limit).toHaveBeenCalledWith(50);
});

test("createPost inserts the post and returns the created row", async () => {
	const createdPost = { id: 3, title: "A new post" };
	const { db, calls } = makeMockDatabase({ createdPosts: [createdPost] });
	vi.mocked(getDb).mockReturnValue(db);

	await expect(createPost({ title: "A new post" })).resolves.toEqual(
		createdPost,
	);

	expect(calls.insert).toHaveBeenCalledOnce();
	expect(calls.values).toHaveBeenCalledWith({ title: "A new post" });
	expect(calls.createReturning).toHaveBeenCalledOnce();
});

test("createPost throws when the insert returns no row", async () => {
	const { db, calls } = makeMockDatabase({ createdPosts: [] });
	vi.mocked(getDb).mockReturnValue(db);

	await expect(createPost({ title: "A post" })).rejects.toThrow(
		"The post could not be created.",
	);
	expect(calls.createReturning).toHaveBeenCalledOnce();
});

test("deletePost filters by id and returns the deleted rows", async () => {
	const deletedPosts = [{ id: 8, title: "Removed post" }];
	const { db, calls } = makeMockDatabase({ deletedPosts });
	vi.mocked(getDb).mockReturnValue(db);

	await expect(deletePost(8)).resolves.toEqual(deletedPosts);

	expect(calls.deleteQuery).toHaveBeenCalledOnce();
	expect(calls.where).toHaveBeenCalledOnce();
	expect(calls.deleteReturning).toHaveBeenCalledOnce();
});
