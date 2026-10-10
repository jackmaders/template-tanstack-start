import { render, screen } from "@testing-library/react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

test("renders a default card and forwards its props", () => {
	render(
		<Card
			aria-label="Account summary"
			className="custom-card"
			data-testid="card"
		>
			Account details
		</Card>,
	);

	const card = screen.getByTestId("card");
	expect(card).toHaveAttribute("data-slot", "card");
	expect(card).toHaveAttribute("data-size", "default");
	expect(card).toHaveAttribute("aria-label", "Account summary");
	expect(card).toHaveClass("custom-card");
	expect(card).toHaveTextContent("Account details");
});

test("renders a small card", () => {
	render(<Card data-testid="small-card" size="sm" />);

	expect(screen.getByTestId("small-card")).toHaveAttribute("data-size", "sm");
});

test("renders a card header with its slot and forwarded props", () => {
	render(
		<CardHeader className="custom-header" data-testid="header" title="Heading">
			Heading content
		</CardHeader>,
	);

	const header = screen.getByTestId("header");
	expect(header).toHaveAttribute("data-slot", "card-header");
	expect(header).toHaveAttribute("title", "Heading");
	expect(header).toHaveClass("custom-header");
	expect(header).toHaveTextContent("Heading content");
});

test("renders a card title with its slot and forwarded props", () => {
	render(
		<CardTitle className="custom-title" data-testid="title" title="Card title">
			Title content
		</CardTitle>,
	);

	const title = screen.getByTestId("title");
	expect(title).toHaveAttribute("data-slot", "card-title");
	expect(title).toHaveAttribute("title", "Card title");
	expect(title).toHaveClass("custom-title");
	expect(title).toHaveTextContent("Title content");
});

test("renders a card description with its slot and forwarded props", () => {
	render(
		<CardDescription
			className="custom-description"
			data-testid="description"
			title="Card description"
		>
			Description content
		</CardDescription>,
	);

	const description = screen.getByTestId("description");
	expect(description).toHaveAttribute("data-slot", "card-description");
	expect(description).toHaveAttribute("title", "Card description");
	expect(description).toHaveClass("custom-description");
	expect(description).toHaveTextContent("Description content");
});

test("renders a card action with its slot and forwarded props", () => {
	render(
		<CardAction
			className="custom-action"
			data-testid="action"
			title="Card action"
		>
			Action content
		</CardAction>,
	);

	const action = screen.getByTestId("action");
	expect(action).toHaveAttribute("data-slot", "card-action");
	expect(action).toHaveAttribute("title", "Card action");
	expect(action).toHaveClass("custom-action");
	expect(action).toHaveTextContent("Action content");
});

test("renders card content with its slot and forwarded props", () => {
	render(
		<CardContent
			className="custom-content"
			data-testid="content"
			title="Card content"
		>
			Content text
		</CardContent>,
	);

	const content = screen.getByTestId("content");
	expect(content).toHaveAttribute("data-slot", "card-content");
	expect(content).toHaveAttribute("title", "Card content");
	expect(content).toHaveClass("custom-content");
	expect(content).toHaveTextContent("Content text");
});

test("renders a card footer with its slot and forwarded props", () => {
	render(
		<CardFooter
			className="custom-footer"
			data-testid="footer"
			title="Card footer"
		>
			Footer content
		</CardFooter>,
	);

	const footer = screen.getByTestId("footer");
	expect(footer).toHaveAttribute("data-slot", "card-footer");
	expect(footer).toHaveAttribute("title", "Card footer");
	expect(footer).toHaveClass("custom-footer");
	expect(footer).toHaveTextContent("Footer content");
});
