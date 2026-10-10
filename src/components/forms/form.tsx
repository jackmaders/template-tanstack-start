import { type ComponentProps, type SubmitEvent, useCallback } from "react";
import { useFormContext } from "./form-context";

interface FormProps extends Omit<ComponentProps<"form">, "onSubmit"> {
	onError?: (error: unknown) => void;
}

export function Form({ onError, ...props }: FormProps) {
	const form = useFormContext();

	const handleSubmit = useCallback(
		async (event: SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
			event.stopPropagation();
			await form.handleSubmit().catch(onError);
		},
		[form, onError],
	);

	return <form onSubmit={handleSubmit} {...props} />;
}
