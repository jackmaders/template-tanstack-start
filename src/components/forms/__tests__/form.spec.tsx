import { fireEvent, render, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { vi } from "vitest";
import { useAppForm } from "../app-form";
import { Form } from "../form";

type FormHarnessProps = {
	onError: (error: unknown) => void;
	onParentSubmit: NonNullable<ComponentProps<"div">["onSubmit"]>;
	onSubmit: () => void | Promise<void>;
};

export function FormHarness({
	onError,
	onParentSubmit,
	onSubmit,
}: FormHarnessProps) {
	const form = useAppForm({ defaultValues: {}, onSubmit });

	return (
		<div onSubmit={onParentSubmit}>
			<form.AppForm>
				<Form aria-label="Example form" onError={onError}>
					<button type="submit">Submit</button>
				</Form>
			</form.AppForm>
		</div>
	);
}

test("prevents the browser submit, stops propagation, and submits the form", async () => {
	const onError = vi.fn();
	const onParentSubmit = vi.fn();
	const onSubmit = vi.fn();
	const { getByRole } = render(
		<FormHarness
			onError={onError}
			onParentSubmit={onParentSubmit}
			onSubmit={onSubmit}
		/>,
	);

	const form = getByRole("form", { name: "Example form" });

	expect(fireEvent.submit(form)).toBe(false);
	await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());

	expect(onError).not.toHaveBeenCalled();
	expect(onParentSubmit).not.toHaveBeenCalled();
});

test("passes a rejected form submission to onError", async () => {
	const error = new Error("Submission failed");
	const onError = vi.fn();
	const onParentSubmit = vi.fn();
	const onSubmit = vi.fn(async () => {
		throw error;
	});
	const { getByRole } = render(
		<FormHarness
			onError={onError}
			onParentSubmit={onParentSubmit}
			onSubmit={onSubmit}
		/>,
	);

	fireEvent.submit(getByRole("form", { name: "Example form" }));
	await waitFor(() => expect(onError).toHaveBeenCalledWith(error));

	expect(onSubmit).toHaveBeenCalledOnce();
	expect(onParentSubmit).not.toHaveBeenCalled();
});
