import { useCallback, useEffect } from "react";
import { dispatchError } from "@/lib/dispatch-error";
import { useSession } from "./auth-client";

/** Session failures are presented inline by each consumer. */
export function useSessionStatus() {
	const session = useSession();
	const { error, refetch } = session;
	useEffect(() => {
		if (error) {
			dispatchError(error, () => true);
		}
	}, [error]);
	const retrySession = useCallback(async () => {
		try {
			await refetch();
		} catch (failure) {
			dispatchError(failure, () => true);
		}
	}, [refetch]);
	return { ...session, retrySession };
}
