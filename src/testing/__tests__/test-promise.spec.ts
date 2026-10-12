import { createTestPromise } from "@/testing/test-promise";

test("allows rejecting a pending request and safely cleans it up", async () => {
	// Arrange
	const request = createTestPromise(null);
	const error = new Error("Request failed");
	const result = request.promise.catch((reason: unknown) => reason);
	// Act
	request.reject(error);
	// Assert
	await expect(result).resolves.toBe(error);
});
