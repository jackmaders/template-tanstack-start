import "@tanstack/react-start/server-only";

import { getRequestHeaders } from "@tanstack/react-start/server";
import { ApplicationError } from "@/lib/errors";
import { auth } from "./auth.server";

export async function getSession() {
	const headers = getRequestHeaders();
	return await auth.api.getSession({ headers });
}

export async function ensureSession() {
	const session = await getSession();

	if (!session) {
		throw new ApplicationError("UNAUTHENTICATED", "Unauthorized");
	}

	return session;
}
