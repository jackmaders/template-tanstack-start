import { type ComponentProps, type SubmitEvent, useCallback } from "react";
import { useFormContext } from "./form-context";

type FormProps = Omit<ComponentProps<"form">, "onSubmit">;

export function Form(props: FormProps) {
	const form = useFormContext();

	const handleSubmit = useCallback(
		(event: SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
			event.stopPropagation();
			void form.handleSubmit();
		},
		[form],
	);

	return <form onSubmit={handleSubmit} {...props} />;
}
