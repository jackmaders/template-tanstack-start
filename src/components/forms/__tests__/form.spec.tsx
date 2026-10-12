import { createFormHookContexts } from "@tanstack/react-form";
import {
	createEvent,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { vi } from "vitest";
import { Form } from "@/components/forms/form";
import { FormSubmissionError } from "@/components/forms/form-submission-error";

vi.mock("@tanstack/react-form");

const { useFormContext } = createFormHookContexts();

test("renders a form and forwards its props and children", () => {
	// Act
	render(
		<Form
			aria-label="Account form"
			className="custom-form"
			data-testid="form"
			id="account-form"
		>
			Account details
		</Form>,
	);

	const form = screen.getByRole("form", { name: "Account form" });

	// Assert
	expect(form).toHaveAttribute("id", "account-form");
	expect(form).toHaveClass("custom-form");
	expect(form).toHaveTextContent("Account details");
});

test("prevents the native submit and stops the event from bubbling", () => {
	// Arrange
	const form = useFormContext();
	const parentOnSubmit = vi.fn();

	// Act
	render(
		<div onSubmit={parentOnSubmit}>
			<Form aria-label="Account form">Account details</Form>
		</div>,
	);

	const element = screen.getByRole("form", { name: "Account form" });
	const event = createEvent.submit(element);
	fireEvent(element, event);

	// Assert
	expect(event.defaultPrevented).toBe(true);
	expect(parentOnSubmit).not.toHaveBeenCalled();
	expect(form.handleSubmit).toHaveBeenCalledOnce();
});

test("passes submission errors to the onError callback", async () => {
	// Arrange
	const form = useFormContext();
	const error = new Error("submission failed");
	const onError = vi.fn();
	vi.mocked(form.handleSubmit).mockRejectedValueOnce(error);

	// Act
	render(
		<Form aria-label="Account form" onError={onError}>
			Account details
		</Form>,
	);

	fireEvent.submit(screen.getByRole("form", { name: "Account form" }));

	// Assert
	await waitFor(() => expect(onError).toHaveBeenCalledWith(error));
	expect(form.handleSubmit).toHaveBeenCalledOnce();
});

test("handles rejected submissions without an error callback", async () => {
	// Arrange
	const form = useFormContext();
	vi.mocked(form.handleSubmit).mockRejectedValueOnce(
		new Error("Internal details"),
	);
	// Act
	render(<Form aria-label="Account form" />);
	fireEvent.submit(screen.getByRole("form", { name: "Account form" }));
	// Assert
	await waitFor(() =>
		expect(form.setErrorMap).toHaveBeenCalledWith({
			onSubmit: { fields: {}, form: "Something went wrong. Please try again." },
		}),
	);
});

test("displays the safe message from a submission error", async () => {
	// Arrange
	const form = useFormContext();
	vi.mocked(form.handleSubmit).mockRejectedValueOnce(
		new FormSubmissionError("Unable to save your changes."),
	);
	// Act
	render(<Form aria-label="Account form" />);
	fireEvent.submit(screen.getByRole("form", { name: "Account form" }));
	// Assert
	await waitFor(() =>
		expect(form.setErrorMap).toHaveBeenCalledWith({
			onSubmit: { fields: {}, form: "Unable to save your changes." },
		}),
	);
});
