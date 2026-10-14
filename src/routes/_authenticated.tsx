import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth/session.server";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const session = await getSession();

		if (!session) {
			throw redirect({ to: "/" });
		}
	},
	component: () => <Outlet />,
});
