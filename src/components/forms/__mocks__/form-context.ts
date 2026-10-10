import type { ReactNode } from "react";
import { vi } from "vitest";
import type { useFormContext as useOriginalFormContext } from "../form-context";

type FormState = { canSubmit: boolean };

type SubscribeProps = {
	selector: (state: FormState) => boolean;
	children: (selected: boolean) => ReactNode;
};

type FormContext = ReturnType<typeof useOriginalFormContext>;

type FieldState = {
	name: string;
	value: string;
	errors: Array<{ message?: string } | undefined>;
	isTouched: boolean;
	isValid: boolean;
};

let canSubmit = true;
let fieldState: FieldState = {
	name: "name",
	value: "",
	errors: [],
	isTouched: false,
	isValid: true,
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
		name: state.name ?? "name",
		value: state.value ?? "",
		errors: state.errors ?? [],
		isTouched: state.isTouched ?? false,
		isValid: state.isValid ?? true,
	};
	handleChange.mockClear();
	handleBlur.mockClear();
}

export function getFieldHandlers() {
	return { handleBlur, handleChange };
}

export function useFieldContext() {
	return {
		name: fieldState.name,
		state: {
			value: fieldState.value,
			meta: {
				errors: fieldState.errors,
				isTouched: fieldState.isTouched,
				isValid: fieldState.isValid,
			},
		},
		handleBlur,
		handleChange,
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
