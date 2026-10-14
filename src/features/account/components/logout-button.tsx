import { type ComponentProps, type MouseEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/account/api/use-sign-out";

interface LogoutButtonProps extends ComponentProps<"button"> {}

export function LogoutButton({
	children = "Log out",
	disabled,
	onClick,
	...props
}: LogoutButtonProps) {
	const { mutate: signOut, isPending } = useSignOut();
	const logout = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			signOut(undefined, { onSettled: () => onClick?.(event) });
		},
		[onClick, signOut],
	);

	return (
		<Button
			aria-busy={isPending}
			disabled={disabled || isPending}
			onClick={logout}
			type="button"
			variant="ghost"
			{...props}
		>
			{children}
		</Button>
	);
}
