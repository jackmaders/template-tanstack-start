// biome-ignore-all lint/style/useNamingConvention: TanStack Form exposes registered components with PascalCase names.

import { createFormHook } from "@tanstack/react-form";
import { Form } from "./form";
import { fieldContext, formContext } from "./form-context";
import { FormError } from "./form-error";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

export const { useAppForm } = createFormHook({
	fieldComponents: { TextField },
	fieldContext,
	formComponents: { Form, FormError, SubmitButton },
	formContext,
});
