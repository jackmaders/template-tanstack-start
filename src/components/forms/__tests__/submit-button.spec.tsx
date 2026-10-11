import { createFormHookContexts } from "@tanstack/react-form";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SubmitButton } from "@/components/forms/submit-button";

vi.mock("@tanstack/react-form");

const { useFormContext } = createFormHookContexts();

test("renders an enabled submit button by default and forwards props", () => {
	// Arrange
	const form = useFormContext();

	// Act
	render(
		<SubmitButton aria-label="Save changes" className="custom-button">
			Save
		</SubmitButton>,
	);

	const button = screen.getByRole("button", { name: "Save changes" });

	// Assert
	expect(button).toHaveAttribute("type", "submit");
	expect(button).toHaveClass("custom-button");
	expect(button).not.toBeDisabled();
	expect(form.Subscribe).toHaveBeenCalledOnce();
});

test("disables the button when the form cannot submit", () => {
	// Arrange
	const form = useFormContext();

	const mockFormCannotSubmit = vi.fn(({ children, selector }) =>
		children(selector({ canSubmit: false })),
	);

	vi.mocked(form.Subscribe).mockImplementationOnce(mockFormCannotSubmit);

	// Act
	render(<SubmitButton>Save</SubmitButton>);

	// Assert
	expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
});

test("keeps an explicitly disabled button disabled when the form can submit", () => {
	// Act
	render(<SubmitButton disabled={true}>Save</SubmitButton>);

	// Assert
	expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
});

test("forwards an explicit button type", () => {
	// Act
	render(
		<SubmitButton type="button" variant="secondary">
			Cancel
		</SubmitButton>,
	);

	const button = screen.getByRole("button", { name: "Cancel" });

	// Assert
	expect(button).toHaveAttribute("type", "button");
	expect(button).not.toBeDisabled();
});

test("disables the button and shows a busy label while submitting", () => {
	// Arrange
	const form = useFormContext();
	const mockFormSubmitting = vi.fn(({ children, selector }) =>
		children(selector({ canSubmit: true, isSubmitting: true })),
	);
	vi.mocked(form.Subscribe).mockImplementationOnce(mockFormSubmitting);
	// Act
	render(<SubmitButton>Save</SubmitButton>);
	// Assert
	const button = screen.getByRole("button", { name: "Please wait…" });
	expect(button).toBeDisabled();
	expect(button).toHaveAttribute("aria-busy", "true");
});
