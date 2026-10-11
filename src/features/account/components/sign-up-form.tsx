import { revalidateLogic } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { useAppForm } from "@/components/forms/app-form";
import type { Form } from "@/components/forms/form";
import { signupSchema } from "@/features/account/api/account.schema";
import { signUp } from "@/lib/auth/auth-client";

interface SignUpFormProps
	extends Omit<ComponentProps<typeof Form>, "children"> {
	onSubmit: () => void;
}

export function SignUpForm({ onSubmit, ...props }: SignUpFormProps) {
	const form = useAppForm({
		defaultValues: { email: "", name: "", password: "" },
		onSubmit: ({ value }) => signUp.email(value),
		validationLogic: revalidateLogic({ mode: "change" }),
		validators: { onDynamic: signupSchema },
	});

	return (
		<form.AppForm>
			<form.Form {...props}>
				<form.AppField name="name">
					{(field) => (
						<field.TextField autoComplete="name" label="Name" required={true} />
					)}
				</form.AppField>
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
							autoComplete="new-password"
							label="Password"
							required={true}
							type="password"
						/>
					)}
				</form.AppField>
				<form.SubmitError />
				<form.SubmitButton>Sign up</form.SubmitButton>
			</form.Form>
		</form.AppForm>
	);
}
