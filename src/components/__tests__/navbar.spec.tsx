import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it } from "vitest";
import { Navbar } from "@/components/navbar";

import { createRouterTestContext } from "@/testing/wrappers/router";

it("opens an empty mobile menu by default", async () => {
	// Arrange
	const user = userEvent.setup();
	const { wrapper } = await createRouterTestContext();
	// Act
	render(<Navbar aria-label="Site header" />, { wrapper });
	await user.click(
		screen.getByRole("button", { name: "Open navigation menu" }),
	);
	// Assert
	expect(screen.getByRole("dialog", { name: "Menu" })).toBeVisible();
	expect(
		within(
			screen.getByRole("navigation", { name: "Mobile navigation" }),
		).queryByRole("link"),
	).not.toBeInTheDocument();
});

it("closes the mobile menu with the close button", async () => {
	// Arrange
	const user = userEvent.setup();
	const { wrapper } = await createRouterTestContext();
	// Act
	render(<Navbar />, { wrapper });
	await user.click(
		screen.getByRole("button", { name: "Open navigation menu" }),
	);
	await user.click(
		screen.getByRole("button", { name: "Close navigation menu" }),
	);
	// Assert
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("renders the home logo link", async () => {
	// Arrange
	const { wrapper } = await createRouterTestContext();
	// Act
	render(<Navbar />, { wrapper });
	// Assert
	expect(screen.getByRole("link", { name: "LOGO" })).toHaveAttribute(
		"href",
		"/",
	);
});

it("forwards header props", async () => {
	// Arrange
	const { wrapper } = await createRouterTestContext();
	// Act
	render(<Navbar aria-label="Site header" />, { wrapper });
	// Assert
	expect(screen.getByRole("banner")).toHaveAttribute(
		"aria-label",
		"Site header",
	);
});

it("renders desktop links and actions", async () => {
	// Arrange
	const { wrapper } = await createRouterTestContext();
	// Act
	render(
		<Navbar
			actions={<button type="button">Account</button>}
			links={[{ children: "Home", to: "/" }]}
		/>,
		{ wrapper },
	);
	// Assert
	expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
		"href",
		"/",
	);
	expect(screen.getByRole("button", { name: "Account" })).toBeVisible();
});

it("renders mobile links and actions", async () => {
	// Arrange
	const user = userEvent.setup();
	const { wrapper } = await createRouterTestContext();
	// Act
	render(
		<Navbar
			actions={<button type="button">Account</button>}
			links={[{ children: "Home", to: "/" }]}
		/>,
		{ wrapper },
	);
	await user.click(
		screen.getByRole("button", { name: "Open navigation menu" }),
	);
	const menu = within(
		screen.getByRole("navigation", { name: "Mobile navigation" }),
	);
	// Assert
	expect(menu.getByRole("button", { name: "Account" })).toBeVisible();
});

it("closes the mobile menu after selecting a destination", async () => {
	// Arrange
	const user = userEvent.setup();
	const { router, wrapper } = await createRouterTestContext();
	// Act
	render(
		<Navbar
			actions={<button type="button">Account</button>}
			links={[{ children: "About", to: "/about" }]}
		/>,
		{ wrapper },
	);
	await user.click(
		screen.getByRole("button", { name: "Open navigation menu" }),
	);
	const menu = within(
		screen.getByRole("navigation", { name: "Mobile navigation" }),
	);
	await user.click(menu.getByRole("button", { name: "About" }));
	// Assert
	expect(router.state.location.pathname).toBe("/about");
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
