export const mutate = vi.fn();
export const mutateAsync = vi.fn();
export const useCreatePost = vi.fn(() => ({ mutate, mutateAsync }));
