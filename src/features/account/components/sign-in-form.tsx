import { revalidateLogic } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { useAppForm } from "@/components/forms/app-form";
import type { Form } from "@/components/forms/form";
import { loginSchema } from "@/features/account/api/account-schema";
import { signInWithEmail } from "@/features/account/api/email-auth";

interface SignInFormProps
	extends Omit<ComponentProps<typeof Form>, "children"> {}

export function SignInForm({ ...props }: SignInFormProps) {
	const form = useAppForm({
		defaultValues: { email: "", password: "" },
		onSubmit: ({ value }) => signInWithEmail(value),
		validationLogic: revalidateLogic({ mode: "change" }),
		validators: { onDynamic: loginSchema },
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
