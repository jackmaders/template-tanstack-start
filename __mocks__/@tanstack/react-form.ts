import { createContext } from "react";
import { vi } from "vitest";

const form = {
	handleSubmit: vi.fn(() => Promise.resolve()),
	Subscribe: vi.fn(({ children, selector }) =>
		children(selector({ canSubmit: true, errorMap: {}, isSubmitting: false })),
	),
	setErrorMap: vi.fn(),
};

const field = {};

const contexts = {
	fieldContext: createContext(null),
	formContext: createContext(null),
	useFieldContext: vi.fn(() => field),
	useFormContext: vi.fn(() => form),
};

export const createFormHookContexts = vi.fn(() => contexts);
