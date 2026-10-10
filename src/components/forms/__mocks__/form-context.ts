import type { ReactNode } from "react";
import { vi } from "vitest";
import type { useFormContext as useOriginalFormContext } from "../form-context";

interface FormState {
	canSubmit: boolean;
}

interface SubscribeProps {
	children: (selected: boolean) => ReactNode;
	selector: (state: FormState) => boolean;
}

type FormContext = ReturnType<typeof useOriginalFormContext>;

interface FieldState {
	errors: Array<{ message?: string } | undefined>;
	isTouched: boolean;
	isValid: boolean;
	name: string;
	value: string;
}

let canSubmit = true;
let fieldState: FieldState = {
	errors: [],
	isTouched: false,
	isValid: true,
	name: "name",
	value: "",
};

const handleChange = vi.fn();
const handleBlur = vi.fn();

function isFormContext(value: unknown): value is FormContext {
	return (
		typeof value === "object" &&
		value !== null &&
		typeof Reflect.get(value, "Subscribe") === "function"
	);
}

export function setFormCanSubmit(value: boolean) {
	canSubmit = value;
}

export function setFieldState(state: Partial<FieldState> = {}) {
	fieldState = {
		errors: state.errors ?? [],
		isTouched: state.isTouched ?? false,
		isValid: state.isValid ?? true,
		name: state.name ?? "name",
		value: state.value ?? "",
	};
	handleChange.mockClear();
	handleBlur.mockClear();
}

export function getFieldHandlers() {
	return { handleBlur, handleChange };
}

export function useFieldContext() {
	return {
		handleBlur,
		handleChange,
		name: fieldState.name,
		state: {
			meta: {
				errors: fieldState.errors,
				isTouched: fieldState.isTouched,
				isValid: fieldState.isValid,
			},
			value: fieldState.value,
		},
	};
}

export function useFormContext() {
	const context = Object.defineProperty({}, "Subscribe", {
		value: ({ selector, children }: SubscribeProps) =>
			children(selector({ canSubmit })),
	});
	if (!isFormContext(context)) {
		throw new Error("The mock form context is missing its Subscribe component");
	}
	return context;
}
