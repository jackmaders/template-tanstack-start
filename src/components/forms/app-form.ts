// biome-ignore-all lint/style/useNamingConvention: TanStack Form exposes registered components with PascalCase names.

import { createFormHook } from "@tanstack/react-form";
import { Form } from "./form";
import { fieldContext, formContext } from "./form-context";
import { TextField } from "./text-field";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: { TextField },
	formComponents: { Form },
});
