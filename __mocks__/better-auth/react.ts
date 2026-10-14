const client = {
	signIn: { email: vi.fn() },
	signOut: vi.fn(),
	signUp: { email: vi.fn() },
	useSession: vi.fn(),
};

export const createAuthClient = vi.fn(() => client);
