import { useMutation } from "@tanstack/react-query";
import type { ErrorHandler } from "@/lib/dispatch-error";
import { errorMeta } from "@/lib/query-client";
import { signUpWithEmail } from "./email-auth";

export function useSignUp({
	handleError,
}: {
	handleError?: ErrorHandler;
} = {}) {
	return useMutation({
		meta: errorMeta(handleError),
		mutationFn: signUpWithEmail,
	});
}
