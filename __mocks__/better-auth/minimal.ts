import type { BetterAuthOptions } from "better-auth";
import { vi } from "vitest";

export const betterAuth = vi.fn((options: BetterAuthOptions) => ({
	handler: vi.fn(),
	options,
}));
