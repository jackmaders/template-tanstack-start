import { createContext } from "react";
import { vi } from "vitest";

const contexts = {
	fieldContext: createContext(null),
	formContext: createContext(null),
	useFieldContext: vi.fn(),
	useFormContext: vi.fn(),
};

export const createFormHookContexts = vi.fn(() => contexts);
