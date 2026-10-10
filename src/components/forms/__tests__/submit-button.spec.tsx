import { createFormHookContexts } from "@tanstack/react-form";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SubmitButton } from "../submit-button";

vi.mock("@tanstack/react-form");

const { useFormContext } = createFormHookContexts();

test("renders an enabled submit button by default and forwards props", () => {
	const form = useFormContext();

	render(
		<SubmitButton aria-label="Save changes" className="custom-button">
			Save
		</SubmitButton>,
	);

	const button = screen.getByRole("button", { name: "Save changes" });
	expect(button).toHaveAttribute("type", "submit");
	expect(button).toHaveClass("custom-button");
	expect(button).not.toBeDisabled();
	expect(form.Subscribe).toHaveBeenCalledOnce();
});

test("disables the button when the form cannot submit", () => {
	const form = useFormContext();

	const mockFormCannotSubmit = vi.fn(({ children, selector }) =>
		children(selector({ canSubmit: false })),
	);

	vi.mocked(form.Subscribe).mockImplementationOnce(mockFormCannotSubmit);

	render(<SubmitButton>Save</SubmitButton>);

	expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
});

test("keeps an explicitly disabled button disabled when the form can submit", () => {
	render(<SubmitButton disabled={true}>Save</SubmitButton>);

	expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
});

test("forwards an explicit button type", () => {
	render(
		<SubmitButton type="button" variant="secondary">
			Cancel
		</SubmitButton>,
	);

	const button = screen.getByRole("button", { name: "Cancel" });
	expect(button).toHaveAttribute("type", "button");
	expect(button).not.toBeDisabled();
});
