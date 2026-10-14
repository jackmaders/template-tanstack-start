import { useMutation } from "@tanstack/react-query";
import type { ErrorHandler } from "@/lib/dispatch-error";
import { errorMeta } from "@/lib/query-client";
import { signInWithEmail } from "./email-auth";

export function useSignIn({
	handleError,
}: {
	handleError?: ErrorHandler;
} = {}) {
	return useMutation({
		meta: errorMeta(handleError),
		mutationFn: signInWithEmail,
	});
}
