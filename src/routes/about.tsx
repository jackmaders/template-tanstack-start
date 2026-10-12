import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	return (
		<main>
			<h1>About this starter</h1>
			<p>
				This template combines TanStack Start, React, TypeScript, and Cloudflare
				Workers to provide a foundation for full-stack applications.
			</p>
		</main>
	);
}
