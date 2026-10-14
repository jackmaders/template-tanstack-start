import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionFn } from "@/lib/auth/session.functions";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const session = await getSessionFn();

		if (!session) {
			throw redirect({ to: "/" });
		}
	},
	component: () => <Outlet />,
});
