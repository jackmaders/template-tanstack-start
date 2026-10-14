import { render, screen } from "@testing-library/react";
import { PostsPage } from "@/features/posts/components/posts-page";

vi.mock("@/features/posts/components/add-post-form");
vi.mock("@/features/posts/components/post-list");

it("renders the page heading, add post form, and post list", () => {
	// Act
	render(<PostsPage />);

	// Assert
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
