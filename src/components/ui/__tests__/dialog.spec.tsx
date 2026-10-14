import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it } from "vitest";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

it("opens an accessible dialog with a close button", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(
		<Dialog>
			<DialogTrigger>Open</DialogTrigger>
			<DialogContent className="custom-content">
				<DialogHeader className="custom-header">
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Change preferences</DialogDescription>
				</DialogHeader>
				<DialogFooter className="custom-footer">
					<DialogClose>Done</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>,
	);
	await user.click(screen.getByRole("button", { name: "Open" }));
	// Assert
	expect(
		screen.getByRole("dialog", { name: "Settings" }),
	).toHaveAccessibleDescription("Change preferences");
	expect(screen.getByRole("dialog")).toHaveClass("custom-content");
	expect(screen.getByRole("button", { name: "Close" })).toBeVisible();
});

it("closes the dialog with a custom close button", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(
		<Dialog>
			<DialogTrigger>Open</DialogTrigger>
			<DialogContent className="custom-content">
				<DialogHeader className="custom-header">
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Change preferences</DialogDescription>
				</DialogHeader>
				<DialogFooter className="custom-footer">
					<DialogClose>Done</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>,
	);
	await user.click(screen.getByRole("button", { name: "Open" }));
	await user.click(screen.getByRole("button", { name: "Done" }));
	// Assert
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("can move the close button to the footer", () => {
	// Arrange
	// Act
	render(
		<Dialog defaultOpen={true}>
			<DialogContent showCloseButton={false}>
				<DialogTitle>Settings</DialogTitle>
				<DialogDescription>Preferences</DialogDescription>
				<DialogFooter showCloseButton={true}>Footer</DialogFooter>
			</DialogContent>
		</Dialog>,
	);
	// Assert
	expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
	expect(screen.getByText("Footer")).toContainElement(
		screen.getByRole("button", { name: "Close" }),
	);
});

it("closes the dialog with the footer close button", async () => {
	// Arrange
	const user = userEvent.setup();
	// Act
	render(
		<Dialog defaultOpen={true}>
			<DialogContent showCloseButton={false}>
				<DialogTitle>Settings</DialogTitle>
				<DialogDescription>Preferences</DialogDescription>
				<DialogFooter showCloseButton={true}>Footer</DialogFooter>
			</DialogContent>
		</Dialog>,
	);
	await user.click(screen.getByRole("button", { name: "Close" }));
	// Assert
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
