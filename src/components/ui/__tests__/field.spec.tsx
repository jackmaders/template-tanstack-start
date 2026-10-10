import { render, screen } from "@testing-library/react";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";

test("renders a field set and forwards its props", () => {
	render(
		<FieldSet className="custom-set" data-testid="field-set" title="Options">
			Set content
		</FieldSet>,
	);

	const fieldSet = screen.getByTestId("field-set");
	expect(fieldSet).toHaveAttribute("data-slot", "field-set");
	expect(fieldSet).toHaveAttribute("title", "Options");
	expect(fieldSet).toHaveClass("custom-set");
	expect(fieldSet).toHaveTextContent("Set content");
});

test("renders legends with the default and label variants", () => {
	render(
		<>
			<FieldLegend data-testid="default-legend">Preferences</FieldLegend>
			<FieldLegend data-testid="label-legend" variant="label">
				Notifications
			</FieldLegend>
		</>,
	);

	expect(screen.getByTestId("default-legend")).toHaveAttribute(
		"data-variant",
		"legend",
	);
	expect(screen.getByTestId("default-legend")).toHaveAttribute(
		"data-slot",
		"field-legend",
	);
	expect(screen.getByTestId("label-legend")).toHaveAttribute(
		"data-variant",
		"label",
	);
});

test("renders a field group and forwards its props", () => {
	render(
		<FieldGroup className="custom-group" data-testid="field-group">
			Group content
		</FieldGroup>,
	);

	const group = screen.getByTestId("field-group");
	expect(group).toHaveAttribute("data-slot", "field-group");
	expect(group).toHaveClass("custom-group");
	expect(group).toHaveTextContent("Group content");
});

test("renders fields with default and explicit orientations", () => {
	render(
		<>
			<Field className="custom-field" data-testid="default-field">
				Default field
			</Field>
			<Field data-testid="horizontal-field" orientation="horizontal" />
			<Field data-testid="responsive-field" orientation="responsive" />
		</>,
	);

	const defaultField = screen.getByTestId("default-field");
	expect(defaultField).toHaveAttribute("data-slot", "field");
	expect(defaultField).toHaveAttribute("data-orientation", "vertical");
	expect(defaultField).toHaveClass("flex-col", "custom-field");
	expect(screen.getByTestId("horizontal-field")).toHaveClass("flex-row");
	expect(screen.getByTestId("horizontal-field")).toHaveAttribute(
		"data-orientation",
		"horizontal",
	);
	expect(screen.getByTestId("responsive-field")).toHaveClass(
		"@md/field-group:flex-row",
	);
});

test("renders field content with its slot, class, and children", () => {
	render(
		<FieldContent className="custom-content" data-testid="field-content">
			Content text
		</FieldContent>,
	);

	const content = screen.getByTestId("field-content");
	expect(content).toHaveAttribute("data-slot", "field-content");
	expect(content).toHaveClass("custom-content");
	expect(content).toHaveTextContent("Content text");
});

test("renders a field label through the shared label component", () => {
	render(
		<FieldLabel
			className="custom-label"
			data-testid="field-label"
			htmlFor="email"
		>
			Email address
		</FieldLabel>,
	);

	const label = screen.getByTestId("field-label");
	expect(label).toHaveAttribute("data-slot", "field-label");
	expect(label).toHaveAttribute("for", "email");
	expect(label).toHaveClass("custom-label");
	expect(label).toHaveTextContent("Email address");
});

test("renders a field title with its slot and props", () => {
	render(
		<FieldTitle className="custom-title" data-testid="field-title">
			Account details
		</FieldTitle>,
	);

	const title = screen.getByTestId("field-title");
	expect(title).toHaveAttribute("data-slot", "field-label");
	expect(title).toHaveClass("custom-title");
	expect(title).toHaveTextContent("Account details");
});

test("renders a field description with its slot and props", () => {
	render(
		<FieldDescription
			className="custom-description"
			data-testid="field-description"
		>
			We use this to contact you.
		</FieldDescription>,
	);

	const description = screen.getByTestId("field-description");
	expect(description).toHaveAttribute("data-slot", "field-description");
	expect(description).toHaveClass("custom-description");
	expect(description).toHaveTextContent("We use this to contact you.");
});

test("renders field separators with and without content", () => {
	render(
		<>
			<FieldSeparator
				className="custom-separator"
				data-testid="empty-separator"
			/>
			<FieldSeparator data-testid="labeled-separator">
				or continue with
			</FieldSeparator>
		</>,
	);

	const emptySeparator = screen.getByTestId("empty-separator");
	expect(emptySeparator).toHaveAttribute("data-slot", "field-separator");
	expect(emptySeparator).toHaveAttribute("data-content", "false");
	expect(emptySeparator).toHaveClass("custom-separator");
	expect(
		emptySeparator.querySelector('[data-slot="field-separator-content"]'),
	).toBeNull();

	const labeledSeparator = screen.getByTestId("labeled-separator");
	expect(labeledSeparator).toHaveAttribute("data-content", "true");
	expect(
		labeledSeparator.querySelector('[data-slot="separator"]'),
	).toBeInTheDocument();
	expect(screen.getByText("or continue with")).toHaveAttribute(
		"data-slot",
		"field-separator-content",
	);
});

test("renders field errors from children and deduplicates a single message", () => {
	render(
		<>
			<FieldError data-testid="child-error">Custom error</FieldError>
			<FieldError
				data-testid="single-error"
				errors={[{ message: "Invalid email" }, { message: "Invalid email" }]}
			/>
		</>,
	);

	const childError = screen.getByTestId("child-error");
	expect(childError).toHaveAttribute("data-slot", "field-error");
	expect(childError).toHaveAttribute("role", "alert");
	expect(childError).toHaveTextContent("Custom error");
	expect(screen.getByTestId("single-error")).toHaveTextContent("Invalid email");
});

test("renders unique field error messages and ignores messages without text", () => {
	render(
		<FieldError
			className="custom-error"
			data-testid="multiple-errors"
			errors={[
				{ message: "Name is required" },
				undefined,
				{ message: "Name is required" },
				{ message: "Name is too short" },
				{ message: undefined },
			]}
		/>,
	);

	const error = screen.getByTestId("multiple-errors");
	expect(error).toHaveAttribute("role", "alert");
	expect(error).toHaveClass("custom-error");
	expect(error.querySelectorAll("li")).toHaveLength(2);
	expect(error).toHaveTextContent("Name is required");
	expect(error).toHaveTextContent("Name is too short");
});

test("does not render field errors when there are no messages", () => {
	render(
		<>
			<FieldError data-testid="missing-errors" />
			<FieldError data-testid="empty-errors" errors={[]} />
			<FieldError data-testid="empty-message" errors={[{ message: "" }]} />
		</>,
	);

	expect(screen.queryByTestId("missing-errors")).not.toBeInTheDocument();
	expect(screen.queryByTestId("empty-errors")).not.toBeInTheDocument();
	expect(screen.queryByTestId("empty-message")).not.toBeInTheDocument();
});
