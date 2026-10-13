import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	type LinkComponentProps,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toast";
import { AccountActions } from "@/features/account/components/account-actions";
import appCss from "@/styles.css?inline";

const links: LinkComponentProps[] = [
	{ children: "Home", to: "/" },
	{ children: "Posts", to: "/posts" },
	{ children: "About", to: "/about" },
];

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		links: [
			{
				href: "/favicon.svg",
				rel: "icon",
				type: "image/svg",
			},
		],
		meta: [
			{
				charSet: "utf-8",
			},
			{
				content: "width=device-width, initial-scale=1",
				name: "viewport",
			},
			{
				content:
					"A starter template for building modern full-stack React apps with TanStack Start.",
				name: "description",
			},
			{
				title: "TanStack Start Starter",
			},
		],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function NotFoundPage() {
	return (
		<main>
			<h1>Page not found</h1>
			<p>The page you requested could not be found.</p>
			<Link to="/">Return home</Link>
		</main>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		document.body.dataset.hydrated = "true";
	}, []);

	return (
		<html className="dark" lang="en">
			{/* biome-ignore lint/style/noHeadElement: head element is requires in root route */}
			<head>
				<HeadContent />
				<style>{appCss}</style>
			</head>
			<body>
				<Navbar actions={<AccountActions />} links={links} />
				{children}
				<Toaster />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
