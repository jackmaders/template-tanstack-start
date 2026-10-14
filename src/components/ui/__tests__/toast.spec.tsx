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

it.each([
	{ hasIcon: true, type: "success" },
	{ hasIcon: true, type: "info" },
	{ hasIcon: true, type: "warning" },
	{ hasIcon: true, type: "error" },
	{ hasIcon: true, type: "loading" },
	{ hasIcon: false, type: "custom" },
] as const)(
	"renders a $type toast with the expected icon presence",
	({ type, hasIcon }) => {
		// Arrange
		const toastManager = createToastManager();
		render(<Toaster timeout={0} toastManager={toastManager} />);
		const title = `${type} toast`;

		// Act
		act(() => {
			toastManager.add({ title, type });
		});

		const toast = screen.getByText(title).closest('[data-slot="toast"]');
		const icon = toast?.querySelector('[data-slot="toast-icon"]');

		// Assert
		expect(toast).toBeInTheDocument();
		expect(icon !== null && icon !== undefined).toBe(hasIcon);
	},
);

it("styles the error toast icon as destructive", () => {
	// Arrange
	const toastManager = createToastManager();
	render(<Toaster timeout={0} toastManager={toastManager} />);

	// Act
	act(() => {
		toastManager.add({ title: "Error toast", type: "error" });
	});

	const toast = screen.getByText("Error toast").closest('[data-slot="toast"]');

	// Assert
	expect(toast?.querySelector('[data-slot="toast-icon"] svg')).toHaveClass(
		"text-destructive",
	);
});

it("animates the loading toast icon", () => {
	// Arrange
	const toastManager = createToastManager();
	render(<Toaster timeout={0} toastManager={toastManager} />);

	// Act
	act(() => {
		toastManager.add({ title: "Loading toast", type: "loading" });
	});

	const toast = screen
		.getByText("Loading toast")
		.closest('[data-slot="toast"]');

	// Assert
	expect(toast?.querySelector('[data-slot="toast-icon"] svg')).toHaveClass(
		"animate-spin",
	);
});

it("renders a close control for manager-created toasts", () => {
	// Arrange
	const toastManager = createToastManager();
	render(<Toaster timeout={0} toastManager={toastManager} />);

	// Act
	act(() => {
		toastManager.add({ title: "Success toast", type: "success" });
	});

	const toast = screen
		.getByText("Success toast")
		.closest('[data-slot="toast"]');

	// Assert
	expect(toast?.querySelector('[data-slot="toast-close"]')).toBeInTheDocument();
});

it("forwards props through toast parts and supports custom action and close content", () => {
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
						render={<button type="button">Dismiss</button>}
					>
						Dismiss
					</ToastClose>
				</ToastContent>
			</Toast>
		</Toaster>,
	);

	const toast = screen.getByTestId("custom-toast");
	const content = screen.getByTestId("custom-content");
	const title = screen.getByTestId("custom-title");
	const description = screen.getByTestId("custom-description");
	const action = screen.getByTestId("custom-action");
	const close = screen.getByTestId("custom-close");

	// Assert
	expect(toast).toHaveAttribute("data-slot", "toast");
	expect(content).toHaveAttribute("data-slot", "toast-content");
	expect(title).toHaveAttribute("data-slot", "toast-title");
	expect(title).toHaveTextContent("Manual title");
	expect(description).toHaveAttribute("data-slot", "toast-description");
	expect(description).toHaveTextContent("Manual description");
	expect(action).toHaveAttribute("data-slot", "toast-action");
	expect(action).toHaveTextContent("Undo");
	expect(close).toHaveAttribute("data-slot", "toast-close");
	expect(close).toHaveAttribute("aria-label", "Close toast");
	expect(close).toHaveTextContent("Dismiss");
});

it("uses the default toast manager when none is provided", () => {
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
