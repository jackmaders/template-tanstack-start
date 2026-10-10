import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./form-context";

const selectCanSubmit = (state: { canSubmit: boolean }) => !state.canSubmit;

export function SubmitButton({
	children,
	type = "submit",
	...props
}: ComponentProps<typeof Button>) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={selectCanSubmit}>
			{(canSubmit) => (
				<Button {...props} disabled={props.disabled || canSubmit} type={type}>
					{children}
				</Button>
			)}
		</form.Subscribe>
	);
}
