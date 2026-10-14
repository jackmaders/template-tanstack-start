import { toast } from "@/components/ui/toast-manager";
import { dispatchError } from "@/lib/dispatch-error";
import { InvalidCredentialsError } from "@/lib/errors";

vi.mock("@/components/ui/toast-manager");

test("allows a local handler to claim presentation", () => {
	// Arrange
	const error = new Error("private details");
	const handleError = vi.fn(() => true);

	// Act
	dispatchError(error, handleError);

	// Assert
	expect(handleError).toHaveBeenCalledExactlyOnceWith(error);
	expect(toast.add).not.toHaveBeenCalled();
});

test.each([
	undefined,
	() => false,
	(() => undefined) as unknown as import("@/lib/dispatch-error").ErrorHandler,
])("shows generic feedback for an unclaimed error (%s)", (handleError) => {
	// Arrange
	const error = new Error("private database details");

	// Act
	dispatchError(error, handleError);

	// Assert
	expect(toast.add).toHaveBeenCalledExactlyOnceWith({
		description: "Something went wrong. Please try again.",
		priority: "high",
		type: "error",
	});
});

test("presents the same rejection only once across integrations", () => {
	// Arrange
	const error = new Error("shared rejection");

	// Act
	dispatchError(error);
	dispatchError(error);

	// Assert
	expect(toast.add).toHaveBeenCalledOnce();
});

test("uses the generic fallback even when a recognized error is unclaimed", () => {
	// Arrange
	const error = new InvalidCredentialsError();

	// Act
	dispatchError(error);

	// Assert
	expect(toast.add).toHaveBeenCalledExactlyOnceWith({
		description: "Something went wrong. Please try again.",
		priority: "high",
		type: "error",
	});
});

test("reports a throwing handler and falls back for the original failure once", () => {
	// Arrange
	const original = new InvalidCredentialsError();
	const failure = new Error("handler failure");
	const report = vi
		.spyOn(console, "error")
		.mockImplementationOnce(() => undefined);
	const handleError = vi.fn(() => {
		throw failure;
	});

	// Act
	dispatchError(original, handleError);
	dispatchError(original, handleError);

	// Assert
	expect(report).toHaveBeenCalledExactlyOnceWith(
		"[Error handler failed]",
		failure,
	);
	expect(toast.add).toHaveBeenCalledOnce();
});

test("does not invoke handlers or show toasts during SSR", () => {
	// Arrange
	const error = new Error("SSR failure");
	const handleError = vi.fn(() => false);
	vi.stubGlobal("window", undefined);

	// Act
	dispatchError(error, handleError);

	// Assert
	expect(handleError).not.toHaveBeenCalled();
	expect(toast.add).not.toHaveBeenCalled();
});

test("still shows feedback if reporting fails", () => {
	// Arrange
	vi.spyOn(console, "error").mockImplementationOnce(() => {
		throw new Error("reporting failed");
	});

	// Act
	dispatchError(new Error("operation failed"));

	// Assert
	expect(toast.add).toHaveBeenCalledOnce();
});

test("deduplicates primitive rejections within the same dispatch turn", () => {
	// Arrange
	const error = "private details";

	// Act
	dispatchError(error);
	dispatchError(error);

	// Assert
	expect(toast.add).toHaveBeenCalledOnce();
});

test("reports a handler failure even if it throws an application error", () => {
	// Arrange
	const operation = new InvalidCredentialsError();
	const failure = new InvalidCredentialsError();
	const report = vi
		.spyOn(console, "error")
		.mockImplementationOnce(() => undefined);

	// Act
	dispatchError(operation, () => {
		throw failure;
	});

	// Assert
	expect(report).toHaveBeenCalledExactlyOnceWith(
		"[Error handler failed]",
		failure,
	);
	expect(toast.add).toHaveBeenCalledOnce();
});
