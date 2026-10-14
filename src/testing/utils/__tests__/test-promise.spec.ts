import { onTestFinished } from "vitest";
import { createTestPromise } from "@/testing/utils/test-promise";

it("propagates a rejected request to its caller", async () => {
	// Arrange
	const request = createTestPromise(null);
	const error = new Error("Request failed");
	const result = request.promise.catch((reason: unknown) => reason);

	// Act
	request.reject(error);

	// Assert
	await expect(result).resolves.toBe(error);
});

it("resolves a pending request with its cleanup value after the test", () => {
	// Arrange
	let result!: Promise<string>;
	onTestFinished(async () => {
		await expect(result).resolves.toBe("Request cleaned up");
	});

	// Act
	const request = createTestPromise("Request cleaned up");
	result = request.promise;

	// Assert
	expect(result).toBeInstanceOf(Promise);
});
