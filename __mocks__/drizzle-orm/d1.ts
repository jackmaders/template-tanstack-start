import { vi } from "vitest";

const database = {};
export const drizzle = vi.fn(() => database);
