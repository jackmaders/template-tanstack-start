import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";
import {
	reportAuthFailureIfUnexpected,
	toAuthSubmissionError,
} from "@/lib/auth/auth-errors";
import { getUserFacingErrorMessage } from "@/lib/errors";
import { LogoutButton } from "./logout-button";
import { SignInDialog } from "./sign-in-dialog";
import { SignUpDialog } from "./sign-up-dialog";

export function AccountActions() {
	const { data, error, isPending, refetch } = useSession();
	const sessionError = error ? toAuthSubmissionError(error, "session") : null;
	const retrySession = useCallback(async () => {
		try {
			await refetch();
		} catch (failure) {
			reportAuthFailureIfUnexpected(failure, "session");
		}
	}, [refetch]);

	useEffect(() => {
		if (error) {
			reportAuthFailureIfUnexpected(error, "session");
		}
	}, [error]);

	if (isPending) {
		return null;
	}

	if (sessionError) {
		return (
			<div role="alert">
				<p>{getUserFacingErrorMessage(sessionError)}</p>
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
