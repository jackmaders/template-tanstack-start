import { act, render, screen } from "@testing-library/react";
import {
	Toast,
	ToastAction,
	ToastClose,
	ToastContent,
	ToastDescription,
	Toaster,
	ToastTitle,
} from "@/components/ui/toast";
import { createToastManager } from "@/components/ui/toast-manager";

test("renders toasts from the manager with icons for each supported type", () => {
	// Arrange
	const toastManager = createToastManager();

	// Act
	render(<Toaster timeout={0} toastManager={toastManager} />);

	act(() => {
		toastManager.add({ title: "Success toast", type: "success" });
		toastManager.add({ title: "Info toast", type: "info" });
		toastManager.add({ title: "Warning toast", type: "warning" });
		toastManager.add({ title: "Error toast", type: "error" });
		toastManager.add({ title: "Loading toast", type: "loading" });
		toastManager.add({ title: "Unknown toast", type: "custom" });
	});

	// Assert
	for (const title of [
		"Success toast",
		"Info toast",
		"Warning toast",
		"Error toast",
		"Loading toast",
		"Unknown toast",
	]) {
		expect(screen.getByText(title)).toBeInTheDocument();
	}

	const iconContainers = document.querySelectorAll('[data-slot="toast-icon"]');
	expect(iconContainers).toHaveLength(5);
	expect(
		screen
			.getByText("Error toast")
			.closest('[data-slot="toast"]')
			?.querySelector('[data-slot="toast-icon"] svg'),
	).toHaveClass("text-destructive");
	expect(
		screen
			.getByText("Loading toast")
			.closest('[data-slot="toast"]')
			?.querySelector('[data-slot="toast-icon"] svg'),
	).toHaveClass("animate-spin");
	expect(document.querySelectorAll('[data-slot="toast-close"]')).toHaveLength(
		6,
	);
	expect(
		document.querySelector('[data-slot="toast-viewport"]'),
	).toBeInTheDocument();
	expect(
		document.querySelector('[data-slot="toast-portal"]'),
	).toBeInTheDocument();
});

test("forwards props through toast parts and supports custom action and close content", () => {
	// Arrange
	const toastManager = createToastManager();

	// Act
	render(
		<Toaster toastManager={toastManager}>
			<Toast
				data-testid="custom-toast"
				toast={{ id: "custom-toast", title: "Manual toast" }}
			>
				<ToastContent data-testid="custom-content">
					<div>
						<ToastTitle data-testid="custom-title">Manual title</ToastTitle>
						<ToastDescription data-testid="custom-description">
							Manual description
						</ToastDescription>
					</div>
					<ToastAction
						data-testid="custom-action"
						render={<button type="button">Undo</button>}
					/>
					<ToastClose
						data-testid="custom-close"
						render={<button type="button" />}
					>
						Dismiss
					</ToastClose>
				</ToastContent>
			</Toast>
		</Toaster>,
	);

	const toast = screen.getByTestId("custom-toast");

	// Assert
	expect(toast).toHaveAttribute("data-slot", "toast");

	const content = screen.getByTestId("custom-content");
	expect(content).toHaveAttribute("data-slot", "toast-content");

	const title = screen.getByTestId("custom-title");
	expect(title).toHaveAttribute("data-slot", "toast-title");
	expect(title).toHaveTextContent("Manual title");

	const description = screen.getByTestId("custom-description");
	expect(description).toHaveAttribute("data-slot", "toast-description");
	expect(description).toHaveTextContent("Manual description");

	const action = screen.getByTestId("custom-action");
	expect(action).toHaveAttribute("data-slot", "toast-action");
	expect(action).toHaveTextContent("Undo");

	const close = screen.getByTestId("custom-close");
	expect(close).toHaveAttribute("data-slot", "toast-close");
	expect(close).toHaveAttribute("aria-label", "Close toast");
	expect(close).toHaveTextContent("Dismiss");
});

test("uses the default toast manager when none is provided", () => {
	// Act
	render(<Toaster>Application content</Toaster>);

	// Assert
	expect(screen.getByText("Application content")).toBeInTheDocument();
	expect(
		document.querySelector('[data-slot="toast-viewport"]'),
	).toBeInTheDocument();
	expect(
		document.querySelector('[data-slot="toast-portal"]'),
	).toBeInTheDocument();
});
