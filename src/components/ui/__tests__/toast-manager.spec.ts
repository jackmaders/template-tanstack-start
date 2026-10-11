import { Toast } from "@base-ui/react/toast";
import {
	createToastManager,
	toast,
	useToastManager,
} from "@/components/ui/toast-manager";

test("exports a toast manager created by Base UI", () => {
	// Act
	const manager = toast;

	// Assert
	expect(manager).toBeDefined();
});

test("re-exports the Base UI manager factory and hook", () => {
	// Act
	const factory = createToastManager;
	const hook = useToastManager;

	// Assert
	expect(factory).toBe(Toast.createToastManager);
	expect(hook).toBe(Toast.useToastManager);
});
