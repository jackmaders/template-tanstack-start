import { createServerFn } from "@tanstack/react-start";
import { ensureSession, getSession } from "@/lib/auth/session";

export const getSessionFn = createServerFn({ method: "GET" }).handler(() =>
	getSession(),
);

export const ensureSessionFn = createServerFn({ method: "GET" }).handler(() =>
	ensureSession(),
);
