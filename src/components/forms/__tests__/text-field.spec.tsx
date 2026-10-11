import { createFormHookContexts } from "@tanstack/react-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TextField } from "@/components/forms/text-field";
import { createTextFieldFixture } from "@/testing/fixtures/text-field";

vi.mock("@tanstack/react-form");

const { useFieldContext } = createFormHookContexts();

test("renders a controlled text field with its label and forwarded props", () => {
	// Arrange
	vi.mocked(useFieldContext<string>, {
		deep: true,
		partial: true,
	}).mockReturnValueOnce(createTextFieldFixture({ value: "ada@example.com" }));

	// Act
	render(
		<TextField
			className="custom-input"
			label="Email address"
			placeholder="you@example.com"
		/>,
	);

	const input = screen.getByRole("textbox", { name: "Email address" });

	// Assert
	expect(input).toHaveValue("ada@example.com");
	expect(input).toHaveAttribute("name", "email");
	expect(input).toHaveAttribute("placeholder", "you@example.com");
	expect(input).toHaveClass("custom-input");
	expect(input).toHaveAttribute("aria-invalid", "false");
	expect(input).not.toHaveAttribute("aria-describedby");
});

test("forwards input changes and blur to the field handlers", async () => {
	// Arrange
	const user = userEvent.setup();
	const field = createTextFieldFixture();
	const { handleChange, handleBlur } = field;
	vi.mocked(useFieldContext<string>, {
		deep: true,
		partial: true,
	}).mockReturnValueOnce(field);

	// Act
	render(<TextField label="Email address" />);
	const input = screen.getByRole("textbox", { name: "Email address" });

	await user.click(input);
	await user.paste("grace@example.com");
	await user.tab();

	// Assert
	expect(handleChange).toHaveBeenCalledOnce();
	expect(handleChange).toHaveBeenCalledWith("grace@example.com");
	expect(handleBlur).toHaveBeenCalledOnce();
});

test("shows validation errors accessibly after an invalid field is touched", () => {
	// Arrange
	vi.mocked(useFieldContext<string>, {
		deep: true,
		partial: true,
	}).mockReturnValueOnce(
		createTextFieldFixture({
			meta: {
				errors: [{ message: "Enter a valid email address" }],
				isTouched: true,
				isValid: false,
			},
		}),
	);

	// Act
	render(<TextField label="Email address" />);

	const input = screen.getByRole("textbox", { name: "Email address" });
	const error = screen.getByRole("alert");

	// Assert
	expect(input).toHaveAttribute("aria-invalid", "true");
	expect(input).toHaveAttribute("aria-describedby", error.id);
	expect(error).toHaveTextContent("Enter a valid email address");
	expect(error).toBeVisible();
});

test("keeps validation errors hidden until the field is touched", () => {
	// Arrange
	vi.mocked(useFieldContext<string>, {
		deep: true,
		partial: true,
	}).mockReturnValueOnce(
		createTextFieldFixture({
			meta: {
				errors: [{ message: "Enter a valid email address" }],
				isTouched: false,
				isValid: false,
			},
		}),
	);

	// Act
	render(<TextField label="Email address" />);

	const input = screen.getByRole("textbox", { name: "Email address" });

	// Assert
	expect(input).toHaveAttribute("aria-invalid", "false");
	expect(input).not.toHaveAttribute("aria-describedby");
	expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	expect(screen.getByText("Enter a valid email address")).not.toBeVisible();
});
