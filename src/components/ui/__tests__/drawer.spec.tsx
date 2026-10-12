import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

test("opens an accessible drawer with default options", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(
		<Drawer>
			<DrawerTrigger>Open</DrawerTrigger>
			<DrawerContent className="custom-popup">
				<DrawerHeader className="custom-header">
					<DrawerTitle>Settings</DrawerTitle>
					<DrawerDescription>Preferences</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="custom-footer">
					<DrawerClose>Done</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>,
	);
	await user.click(screen.getByRole("button", { name: "Open" }));
	const drawer = screen.getByRole("dialog", { name: "Settings" });
	// Assert
	expect(drawer).toHaveAccessibleDescription("Preferences");
	expect(drawer).toHaveClass("custom-popup");
	expect(drawer).toHaveAttribute("data-swipe-axis", "y");
	expect(
		document.querySelector('[data-slot="drawer-overlay"]'),
	).toBeInTheDocument();
	expect(
		document.querySelector('[data-slot="drawer-swipe-handle"]'),
	).not.toBeInTheDocument();
});

test("closes the drawer with its close button", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(
		<Drawer>
			<DrawerTrigger>Open</DrawerTrigger>
			<DrawerContent className="custom-popup">
				<DrawerHeader className="custom-header">
					<DrawerTitle>Settings</DrawerTitle>
					<DrawerDescription>Preferences</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="custom-footer">
					<DrawerClose>Done</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>,
	);
	await user.click(screen.getByRole("button", { name: "Open" }));
	await user.click(screen.getByRole("button", { name: "Done" }));
	// Assert
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("supports up drawers without a modal overlay", () => {
	// Act
	render(
		<Drawer
			defaultOpen={true}
			modal={false}
			showSwipeHandle={true}
			snapPoints={[0.5, 1]}
			swipeDirection="up"
		>
			<DrawerContent>
				<DrawerTitle>Settings</DrawerTitle>
				<DrawerDescription>Preferences</DrawerDescription>
			</DrawerContent>
		</Drawer>,
	);
	// Assert
	expect(screen.getByRole("dialog")).toHaveAttribute("data-swipe-axis", "y");
	expect(screen.getByRole("dialog")).toHaveAttribute("data-snap-points");
	expect(
		document.querySelector('[data-slot="drawer-overlay"]'),
	).not.toBeInTheDocument();
	expect(
		document.querySelector('[data-slot="drawer-swipe-handle"]'),
	).toBeInTheDocument();
});

test("supports left drawers without a modal overlay", () => {
	// Act
	render(
		<Drawer
			defaultOpen={true}
			modal={false}
			showSwipeHandle={true}
			snapPoints={[0.5, 1]}
			swipeDirection="left"
		>
			<DrawerContent>
				<DrawerTitle>Settings</DrawerTitle>
				<DrawerDescription>Preferences</DrawerDescription>
			</DrawerContent>
		</Drawer>,
	);
	// Assert
	expect(screen.getByRole("dialog")).toHaveAttribute("data-swipe-axis", "x");
	expect(screen.getByRole("dialog")).toHaveAttribute("data-snap-points");
	expect(
		document.querySelector('[data-slot="drawer-overlay"]'),
	).not.toBeInTheDocument();
	expect(
		document.querySelector('[data-slot="drawer-swipe-handle"]'),
	).toBeInTheDocument();
});

test("supports right drawers without a modal overlay", () => {
	// Act
	render(
		<Drawer
			defaultOpen={true}
			modal={false}
			showSwipeHandle={true}
			snapPoints={[0.5, 1]}
			swipeDirection="right"
		>
			<DrawerContent>
				<DrawerTitle>Settings</DrawerTitle>
				<DrawerDescription>Preferences</DrawerDescription>
			</DrawerContent>
		</Drawer>,
	);
	// Assert
	expect(screen.getByRole("dialog")).toHaveAttribute("data-swipe-axis", "x");
	expect(screen.getByRole("dialog")).toHaveAttribute("data-snap-points");
	expect(
		document.querySelector('[data-slot="drawer-overlay"]'),
	).not.toBeInTheDocument();
	expect(
		document.querySelector('[data-slot="drawer-swipe-handle"]'),
	).toBeInTheDocument();
});

test("marks a modal overlay when snap points are configured", () => {
	// Act
	render(
		<Drawer defaultOpen={true} snapPoints={[1]}>
			<DrawerContent>
				<DrawerTitle>Settings</DrawerTitle>
				<DrawerDescription>Preferences</DrawerDescription>
			</DrawerContent>
		</Drawer>,
	);
	// Assert
	expect(
		document.querySelector('[data-slot="drawer-overlay"]'),
	).toHaveAttribute("data-snap-points");
});

test("rejects drawer content without a drawer provider", () => {
	// Act
	const renderWithoutProvider = () => render(<DrawerContent />);
	// Assert
	expect(renderWithoutProvider).toThrow(
		"useDrawer must be used within a Drawer.",
	);
});
