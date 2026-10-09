import { render, screen } from "@testing-library/react";
import { Route } from "../index";

test("renders the starter welcome page", () => {
	const Home = Route.options.component;

	if (!Home) {
		throw new Error("The index route must define a component");
	}

	render(<Home />);

	expect(
		screen.getByRole("heading", { name: "Welcome to TanStack Start" }),
	).toBeInTheDocument();
	expect(screen.getByText("Edit", { exact: false })).toHaveTextContent(
		"Edit src/routes/index.tsx to get started.",
	);
});
