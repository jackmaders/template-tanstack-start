import { vi } from "vitest";

export const signIn = { email: vi.fn() };
export const signUp = { email: vi.fn() };
export const signOut = vi.fn();
export const useSession = vi.fn(() => ({
	data: null,
	error: null,
	isPending: false,
	refetch: vi.fn(),
}));
