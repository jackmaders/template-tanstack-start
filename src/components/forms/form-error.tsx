import type { ComponentProps } from "react";
import { FieldError } from "@/components/ui/field";
import { useFormContext } from "./form-context";

const selectSubmitError = (state: { errorMap: { onSubmit?: unknown } }) =>
	state.errorMap.onSubmit;

export function FormError(
	props: Omit<ComponentProps<typeof FieldError>, "children" | "errors">,
) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={selectSubmitError}>
			{(error) =>
				typeof error === "string" ? (
					<FieldError {...props}>{error}</FieldError>
				) : null
			}
		</form.Subscribe>
	);
}
