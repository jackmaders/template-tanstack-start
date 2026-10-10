import { render, screen } from "@testing-library/react";
import { PostsPage } from "@/features/posts/components/posts-page";

vi.mock("@/features/posts/components/add-post-form");
vi.mock("@/features/posts/components/post-list");

test("renders the page heading and its post components", () => {
	render(<PostsPage />);

	expect(
		screen.getByRole("heading", {
			level: 1,
			name: "Welcome to TanStack Start",
		}),
	).toBeInTheDocument();
	expect(screen.getByTestId("add-post-form")).toBeInTheDocument();
	expect(screen.getByTestId("post-list")).toBeInTheDocument();
});
