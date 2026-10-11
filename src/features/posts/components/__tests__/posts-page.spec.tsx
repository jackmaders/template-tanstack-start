import { render, screen } from "@testing-library/react";
import { PostsPage } from "../posts-page";

vi.mock("../add-post-form");
vi.mock("../post-list");

test("renders the page heading, add post form, and post list", () => {
	render(<PostsPage />);

	expect(screen.getByRole("main")).toBeInTheDocument();
	expect(
		screen.getByRole("heading", {
			level: 1,
			name: "Welcome to TanStack Start",
		}),
	).toBeInTheDocument();
	expect(screen.getByTestId("add-post-form")).toBeInTheDocument();
	expect(screen.getByTestId("post-list")).toBeInTheDocument();
});
