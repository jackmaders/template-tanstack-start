import { Toast } from "@base-ui/react/toast";
import {
	createToastManager,
	toast,
	useToastManager,
} from "@/components/ui/toast-manager";

test("exports a toast manager created by Base UI", () => {
	expect(toast).toBeDefined();
});

test("re-exports the Base UI manager factory and hook", () => {
	expect(createToastManager).toBe(Toast.createToastManager);
	expect(useToastManager).toBe(Toast.useToastManager);
});
