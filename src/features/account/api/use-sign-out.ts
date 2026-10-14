import { useMutation } from "@tanstack/react-query";
import type { ErrorHandler } from "@/lib/dispatch-error";
import { errorMeta } from "@/lib/query-client";
import { signOutUser } from "./email-auth";

export function useSignOut({
	handleError,
}: {
	handleError?: ErrorHandler;
} = {}) {
	return useMutation({
		meta: errorMeta(handleError),
		mutationFn: signOutUser,
	});
}
