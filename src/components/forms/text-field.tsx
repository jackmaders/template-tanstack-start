import {
	type ChangeEvent,
	type ComponentProps,
	useCallback,
	useId,
} from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "./form-context";

type TextFieldProps = Omit<
	ComponentProps<typeof Input>,
	| "aria-describedby"
	| "aria-invalid"
	| "id"
	| "name"
	| "onBlur"
	| "onChange"
	| "value"
> & {
	label: string;
};

export function TextField({ label, ...inputProps }: TextFieldProps) {
	const field = useFieldContext<string>();
	const id = useId();
	const errorId = `${id}-error`;
	const errors = field.state.meta.errors;
	const isInvalid = errors.length > 0;

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			field.handleChange(event.currentTarget.value);
		},
		[field],
	);

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input
				{...inputProps}
				aria-describedby={isInvalid ? errorId : undefined}
				aria-invalid={isInvalid}
				id={id}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={handleChange}
				value={field.state.value}
			/>
			<FieldError errors={errors} id={errorId} />
		</Field>
	);
}
