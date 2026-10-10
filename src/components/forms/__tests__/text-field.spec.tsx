import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import {
	getFieldHandlers,
	setFieldState,
} from "@/components/forms/__mocks__/form-context";
import { TextField } from "../text-field";

vi.mock("@/components/forms/form-context");

beforeEach(() => setFieldState());

test("connects the labeled input to the field and forwards input props", () => {
	setFieldState({ name: "email", value: "person@example.com" });
	render(
		<TextField
			aria-label="Email address"
			className="custom-input"
			label="Email"
			placeholder="you@example.com"
		/>,
	);

	const input = screen.getByRole("textbox", { name: "Email address" });
	const label = screen.getByText("Email");
	const field = input.closest("fieldset");

	expect(input).toHaveValue("person@example.com");
	expect(input).toHaveAttribute("name", "email");
	expect(input).toHaveAttribute("id");
	expect(label).toHaveAttribute("for", input.id);
	expect(input).toHaveAttribute("placeholder", "you@example.com");
	expect(input).toHaveClass("custom-input");
	expect(input).toHaveAttribute("aria-invalid", "false");
	expect(input).not.toHaveAttribute("aria-describedby");
	expect(field).toHaveAttribute("data-invalid", "false");

	fireEvent.change(input, { target: { value: "updated@example.com" } });
	fireEvent.blur(input);

	const handlers = getFieldHandlers();
	expect(handlers.handleChange).toHaveBeenCalledOnce();
	expect(handlers.handleChange).toHaveBeenCalledWith("updated@example.com");
	expect(handlers.handleBlur).toHaveBeenCalledOnce();
});

test("does not mark an invalid field until it has been touched", () => {
	setFieldState({ isTouched: false, isValid: false });
	render(<TextField label="Display name" />);

	const input = screen.getByRole("textbox", { name: "Display name" });
	expect(input).toHaveAttribute("aria-invalid", "false");
	expect(input).not.toHaveAttribute("aria-describedby");
	expect(input.closest("fieldset")).toHaveAttribute("data-invalid", "false");
});

test("connects a touched validation error to the input", () => {
	setFieldState({
		errors: [{ message: "Enter a valid email address" }],
		isTouched: true,
		isValid: false,
	});
	render(<TextField label="Email" />);

	const input = screen.getByRole("textbox", { name: "Email" });
	const error = screen.getByRole("alert");

	expect(error).toHaveTextContent("Enter a valid email address");
	expect(input).toHaveAttribute("aria-invalid", "true");
	expect(input).toHaveAttribute("aria-describedby", error.id);
	expect(input.closest("fieldset")).toHaveAttribute("data-invalid", "true");
});
