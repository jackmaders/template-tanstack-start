import { Toast } from "@base-ui/react/toast";

export const toast = Toast.createToastManager();
export const { createToastManager, useToastManager } = Toast;

export function addErrorToast(error: Error) {
	toast.add({
		description: error.message,
		priority: "high",
		type: "error",
	});
}
