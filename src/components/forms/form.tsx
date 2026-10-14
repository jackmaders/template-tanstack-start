import { type ComponentProps, type SubmitEvent, useCallback } from "react";
import { getUserFacingErrorMessage, reportUnexpectedError } from "@/lib/errors";
import { useFormContext } from "./form-context";

interface FormProps
	extends Omit<ComponentProps<"form">, "onSubmit" | "onError"> {
	onError?: (error: unknown) => void;
}

export function Form({ onError, ...props }: FormProps) {
	const form = useFormContext();

	const handleSubmit = useCallback(
		async (event: SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
			event.stopPropagation();
			try {
				await form.handleSubmit();
			} catch (error) {
				reportUnexpectedError(error, "Form submission failed");
				form.setErrorMap({
					onSubmit: {
						fields: {},
						form: getUserFacingErrorMessage(error),
					},
				});
				onError?.(error);
			}
		},
		[form, onError],
	);

	return <form onSubmit={handleSubmit} {...props} />;
}
