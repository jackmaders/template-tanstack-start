import type { BetterAuthOptions } from "better-auth";

export const betterAuth = vi.fn((options: BetterAuthOptions) => ({
	handler: vi.fn(),
	options,
}));
