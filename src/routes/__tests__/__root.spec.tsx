import { Children, isValidElement } from "react";
import { Route } from "../__root";

test("provides the document metadata and stylesheet", () => {
	const headFunction = Route.options.head;

	if (!headFunction) {
		throw new Error("The root route must define a head function");
	}

	const head = Reflect.apply(headFunction, undefined, []);

	expect(head.meta).toEqual([
		{ charSet: "utf-8" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		{ title: "TanStack Start Starter" },
	]);
	expect(head.links).toHaveLength(1);
	expect(head.links[0]).toMatchObject({
		rel: "stylesheet",
		href: expect.any(String),
	});
});

test("builds the root HTML document around the page content", () => {
	const page = <main>Page content</main>;
	const shellComponent: unknown = Reflect.get(Route.options, "shellComponent");

	if (typeof shellComponent !== "function") {
		throw new Error("The root route must define a shell component");
	}

	const document = shellComponent({ children: page });

	if (!isValidElement<{ children: React.ReactNode; lang: string }>(document)) {
		throw new Error("The root shell must return an HTML document element");
	}

	const [head, body] = Children.toArray(document.props.children);

	expect(document.type).toBe("html");
	expect(document.props.lang).toBe("en");
	expect(isValidElement(head) && head.type === "head").toBe(true);

	if (!isValidElement<{ children: React.ReactNode }>(body)) {
		throw new Error("The root shell must render a body element");
	}

	const [pageContent, devtools, scripts] = Children.toArray(
		body.props.children,
	);
	expect(
		isValidElement<{ children: string }>(pageContent) &&
			pageContent.props.children,
	).toBe("Page content");
	expect(
		isValidElement<{ config: unknown }>(devtools) && devtools.props.config,
	).toEqual({
		position: "bottom-right",
	});
	expect(isValidElement(scripts)).toBe(true);
});
