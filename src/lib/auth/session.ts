import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth.server";

export async function getSession() {
	const headers = getRequestHeaders();
	return await auth.api.getSession({ headers });
}

export async function ensureSession() {
	const session = await getSession();

	if (!session) {
		throw new Error("Unauthorized");
	}

	return session;
}
