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

export function TextField({ label, ...props }: TextFieldProps) {
	const field = useFieldContext<string>();
	const id = useId();
	const errorId = `${id}-error`;
	const { errors, isTouched, isValid } = field.state.meta;
	const isInvalid = !isValid && isTouched;

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
				{...props}
				aria-describedby={isInvalid ? errorId : undefined}
				aria-invalid={isInvalid}
				id={id}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={handleChange}
				value={field.state.value}
			/>
			<FieldError errors={errors} hidden={!isInvalid} id={errorId} />
		</Field>
	);
}
