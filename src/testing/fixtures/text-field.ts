import type { PartialDeep } from "type-fest";
import type { useFieldContext } from "@/components/forms/form-context";

type Field = ReturnType<typeof useFieldContext<string>>;
type CreateTextFieldFixtureProps = PartialDeep<
	Pick<Field, "handleBlur" | "handleChange" | "name" | "state">
>;

export function createTextFieldFixture({
	state: { meta = {}, ...state } = {},
	...overrides
}: CreateTextFieldFixtureProps = {}) {
	return {
		handleBlur: vi.fn<Field["handleBlur"]>(),
		handleChange: vi.fn<Field["handleChange"]>(),
		name: "email",
		state: {
			meta: { errors: [], isTouched: false, isValid: true, ...meta },
			value: "",
			...state,
		},
		...overrides,
	};
}
