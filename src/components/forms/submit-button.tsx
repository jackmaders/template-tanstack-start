import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./form-context";

function selectSubmitState(state: {
	canSubmit: boolean;
	isSubmitting: boolean;
}) {
	return [state.canSubmit, state.isSubmitting] as const;
}

export function SubmitButton({
	children,
	type = "submit",
	...props
}: ComponentProps<typeof Button>) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={selectSubmitState}>
			{([canSubmit, isSubmitting]) => (
				<Button
					{...props}
					aria-busy={isSubmitting}
					disabled={props.disabled || !canSubmit || isSubmitting}
					type={type}
				>
					{isSubmitting ? "Please wait…" : <span>{children}</span>}
				</Button>
			)}
		</form.Subscribe>
	);
}
