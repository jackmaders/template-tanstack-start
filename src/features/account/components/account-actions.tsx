import { Button } from "@/components/ui/button";
import { useSessionStatus } from "@/lib/auth/use-session-status";
import { LogoutButton } from "./logout-button";
import { SignInDialog } from "./sign-in-dialog";
import { SignUpDialog } from "./sign-up-dialog";

export function AccountActions() {
	const { data, error, isPending, retrySession } = useSessionStatus();

	if (isPending) {
		return null;
	}

	if (error) {
		return (
			<div role="alert">
				<p>Unable to check your sign-in status. Please try again.</p>
				<Button onClick={retrySession} type="button" variant="outline">
					Try again
				</Button>
			</div>
		);
	}

	if (data) {
		return <LogoutButton />;
	}

	return (
		<>
			<SignUpDialog />
			<SignInDialog />
		</>
	);
}
