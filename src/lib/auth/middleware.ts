import { createMiddleware } from "@tanstack/react-start";
import { ensureSessionFn } from "@/lib/auth/auth.functions";

export const authMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const session = await ensureSessionFn();
	return await next({ context: { session } });
});
