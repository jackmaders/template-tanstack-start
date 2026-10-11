// biome-ignore-all lint/style/noHeadElement: head element is requires in root route

import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	type LinkComponentProps,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toast";
import appCss from "@/styles.css?inline";

const navigation: LinkComponentProps[] = [
	{ children: "Home", to: "/" },
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
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html className="dark" lang="en">
			<head>
				<HeadContent />
				<style>{appCss}</style>
			</head>
			<body>
				<Navbar navigation={navigation} />
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
