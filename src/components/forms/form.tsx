import { type ComponentProps, type SubmitEvent, useCallback } from "react";
import { useFormContext } from "./form-context";
import { FormSubmissionError } from "./form-submission-error";

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
				form.setErrorMap({
					onSubmit: {
						fields: {},
						form:
							error instanceof FormSubmissionError
								? error.message
								: "Something went wrong. Please try again.",
					},
				});
				onError?.(error);
			}
		},
		[form, onError],
	);

	return <form onSubmit={handleSubmit} {...props} />;
}
