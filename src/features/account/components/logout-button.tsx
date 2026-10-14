import {
	type ComponentProps,
	type MouseEvent,
	useCallback,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast-manager";
import { signOutUser } from "@/features/account/api/email-auth";
import { getUserFacingErrorMessage, reportUnexpectedError } from "@/lib/errors";

interface LogoutButtonProps extends ComponentProps<"button"> {}

export function LogoutButton({
	children = "Log out",
	disabled,
	onClick,
	...props
}: LogoutButtonProps) {
	const [pending, setPending] = useState(false);

	const logout = useCallback(
		async (e: MouseEvent<HTMLButtonElement>) => {
			setPending(true);
			try {
				await signOutUser();
			} catch (error) {
				reportUnexpectedError(error, "Sign out failed");
				toast.add({
					description: getUserFacingErrorMessage(error),
					priority: "high",
					type: "error",
				});
			} finally {
				setPending(false);
				onClick?.(e);
			}
		},
		[onClick],
	);

	return (
		<Button
			aria-busy={pending}
			disabled={disabled || pending}
			onClick={logout}
			type="button"
			variant="ghost"
			{...props}
		>
			{children}
		</Button>
	);
}
