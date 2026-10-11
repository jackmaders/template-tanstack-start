import {
	type ComponentProps,
	type MouseEvent,
	useCallback,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast-manager";
import { signOut } from "@/lib/auth/auth-client";

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
				const { error } = await signOut();

				if (error) {
					toast.add({
						description: error.message,
						priority: "high",
						type: "error",
					});
				}
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
