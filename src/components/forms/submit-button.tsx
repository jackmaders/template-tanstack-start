import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./form-context";

const selectIsDisabled = (state: { isDirty: boolean; isSubmitting: boolean }) =>
	!state.isDirty || state.isSubmitting;

export function SubmitButton({
	children,
	type = "submit",
	...props
}: ComponentProps<typeof Button>) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={selectIsDisabled}>
			{(disabled) => (
				<Button {...props} disabled={props.disabled || disabled} type={type}>
					{children}
				</Button>
			)}
		</form.Subscribe>
	);
}
