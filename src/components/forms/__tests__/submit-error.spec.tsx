import { createFormHookContexts } from "@tanstack/react-form";
import { render, screen } from "@testing-library/react";
import { SubmitError } from "@/components/forms/submit-error";

vi.mock("@tanstack/react-form");
const { useFormContext } = createFormHookContexts();

test("renders nothing when there is no submission error", () => {
	// Act
	render(<SubmitError />);
	// Assert
	expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("renders the submission error as an alert and forwards props", () => {
	// Arrange
	const form = useFormContext();
	const mockSubmitError = vi.fn(({ children, selector }) =>
		children(selector({ errorMap: { onSubmit: "Invalid credentials" } })),
	);
	vi.mocked(form.Subscribe).mockImplementationOnce(mockSubmitError);
	// Act
	render(<SubmitError className="custom-error" id="submit-error" />);
	// Assert
	expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
	expect(screen.getByRole("alert")).toHaveAttribute("id", "submit-error");
	expect(screen.getByRole("alert")).toHaveClass("custom-error");
});
