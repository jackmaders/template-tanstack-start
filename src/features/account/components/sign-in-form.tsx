import { revalidateLogic } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { useAppForm } from "@/components/forms/app-form";
import type { Form } from "@/components/forms/form";
import { handleFormError } from "@/components/forms/handle-form-error";
import { loginSchema } from "@/features/account/api/account-schema";
import { useSignIn } from "@/features/account/api/use-sign-in";

interface SignInFormProps
	extends Omit<ComponentProps<typeof Form>, "children"> {}

export function SignInForm({ ...props }: SignInFormProps) {
	const form = useAppForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			await signIn(value);
		},
		validationLogic: revalidateLogic({ mode: "change" }),
		validators: { onDynamic: loginSchema },
	});
	const { mutateAsync: signIn } = useSignIn({
		handleError: (error) => handleFormError(form, error),
	});

	return (
		<form.AppForm>
			<form.Form {...props}>
				<form.AppField name="email">
					{(field) => (
						<field.TextField
							autoComplete="email"
							label="Email"
							required={true}
							type="email"
						/>
					)}
				</form.AppField>
				<form.AppField name="password">
					{(field) => (
						<field.TextField
							autoComplete="current-password"
							label="Password"
							required={true}
							type="password"
						/>
					)}
				</form.AppField>
				<form.FormError />
				<form.SubmitButton>Sign In</form.SubmitButton>
			</form.Form>
		</form.AppForm>
	);
}
