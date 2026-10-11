import { vi } from "vitest";
import type { useFieldContext } from "@/components/forms/form-context";

type Field = ReturnType<typeof useFieldContext<string>>;
type Meta = Pick<Field["state"]["meta"], "errors" | "isTouched" | "isValid">;

type FieldFixture = Pick<Field, "name" | "handleBlur" | "handleChange"> & {
	state: { value: string; meta: Meta };
};

interface FieldOverrides {
	meta?: Partial<Meta>;
	name?: string;
	value?: string;
}

export function createTextFieldFixture({
	name = "email",
	value = "",
	meta = {},
}: FieldOverrides = {}): FieldFixture {
	return {
		handleBlur: vi.fn<Field["handleBlur"]>(),
		handleChange: vi.fn<Field["handleChange"]>(),
		name,
		state: {
			meta: { errors: [], isTouched: false, isValid: true, ...meta },
			value,
		},
	};
}
