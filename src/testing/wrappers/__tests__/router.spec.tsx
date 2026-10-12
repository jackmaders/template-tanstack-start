import { Link } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { createRouterTestContext } from "@/testing/wrappers/router";

test("starts at a custom location and supports rerendering its children", async () => {
	// Arrange
	const { router, wrapper } = await createRouterTestContext("/about");
	const { rerender } = render(<Link to="/about">Original</Link>, { wrapper });
	// Act
	rerender(<Link to="/about">Updated</Link>);
	// Assert
	expect(router.state.location.pathname).toBe("/about");
	expect(screen.getByRole("link", { name: "Updated" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	expect(
		screen.queryByRole("link", { name: "Original" }),
	).not.toBeInTheDocument();
});
