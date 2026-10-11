import { useSession } from "@/lib/auth/auth-client";
import { LogoutButton } from "./logout-button";
import { SignInDialog } from "./sign-in-dialog";
import { SignUpDialog } from "./sign-up-dialog";

export function AccountActions() {
	const { data } = useSession();

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
