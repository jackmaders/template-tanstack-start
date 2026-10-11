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

vi.mock("@tanstack/react-form");

const { useFormContext } = createFormHookContexts();

test("renders a form and forwards its props and children", () => {
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
	expect(form).toHaveAttribute("id", "account-form");
	expect(form).toHaveClass("custom-form");
	expect(form).toHaveTextContent("Account details");
});

test("prevents the native submit and stops the event from bubbling", () => {
	const form = useFormContext();
	const parentOnSubmit = vi.fn();

	render(
		<div onSubmit={parentOnSubmit}>
			<Form aria-label="Account form">Account details</Form>
		</div>,
	);

	const element = screen.getByRole("form", { name: "Account form" });
	const event = createEvent.submit(element);
	fireEvent(element, event);

	expect(event.defaultPrevented).toBe(true);
	expect(parentOnSubmit).not.toHaveBeenCalled();
	expect(form.handleSubmit).toHaveBeenCalledOnce();
});

test("passes submission errors to the onError callback", async () => {
	const form = useFormContext();
	const error = new Error("submission failed");
	const onError = vi.fn();
	vi.mocked(form.handleSubmit).mockRejectedValue(error);
	render(
		<Form aria-label="Account form" onError={onError}>
			Account details
		</Form>,
	);

	fireEvent.submit(screen.getByRole("form", { name: "Account form" }));

	await waitFor(() => expect(onError).toHaveBeenCalledWith(error));
	expect(form.handleSubmit).toHaveBeenCalledOnce();
});
