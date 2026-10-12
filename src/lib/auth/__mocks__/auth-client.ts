import { vi } from "vitest";
import { TEST_SESSION } from "@/testing/fixtures/session";

export const signIn = { email: vi.fn() };
export const signUp = { email: vi.fn() };
export const signOut = vi.fn();
export const useSession = vi.fn(() => ({
	data: TEST_SESSION,
	error: null,
	isPending: false,
	refetch: vi.fn(),
}));
