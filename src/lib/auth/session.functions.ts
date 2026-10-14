import { createServerFn } from "@tanstack/react-start";
import { getSession } from "./session.server";

export const getSessionFn = createServerFn({ method: "GET" }).handler(() =>
	getSession(),
);
