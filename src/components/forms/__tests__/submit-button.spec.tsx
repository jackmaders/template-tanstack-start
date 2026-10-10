import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { setFormCanSubmit } from "@/components/forms/__mocks__/form-context";
import { SubmitButton } from "../submit-button";

vi.mock("@/components/forms/form-context");

beforeEach(() => setFormCanSubmit(true));

test("renders an enabled submit button by default and forwards button props", () => {
	render(
		<SubmitButton aria-label="Save changes" data-testid="submit-action">
			Save
		</SubmitButton>,
	);

	const button = screen.getByRole("button", { name: "Save changes" });
	expect(button).toBeEnabled();
	expect(button).toHaveAttribute("type", "submit");
	expect(button).toHaveAttribute("aria-label", "Save changes");
	expect(button).toHaveAttribute("data-testid", "submit-action");
});

test("disables the button when the form cannot submit", () => {
	setFormCanSubmit(false);
	render(<SubmitButton type="button">Save</SubmitButton>);

	const button = screen.getByRole("button", { name: "Save" });
	expect(button).toBeDisabled();
	expect(button).toHaveAttribute("type", "button");
});

test("keeps an explicitly disabled button disabled when the form can submit", () => {
	render(
		<SubmitButton disabled type="button">
			Save
		</SubmitButton>,
	);

	expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
});
