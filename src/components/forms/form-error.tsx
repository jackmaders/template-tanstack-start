import type { ComponentProps } from "react";
import { FieldError } from "@/components/ui/field";
import { useFormContext } from "./form-context";

function selectSubmitError(state: { errorMap: { onSubmit?: unknown } }) {
	return state.errorMap.onSubmit;
}

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
