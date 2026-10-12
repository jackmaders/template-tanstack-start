import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<main>
			<h1>Welcome to TanStack Start</h1>
			<p>Sign in or create an account to view your posts.</p>
			<Link to="/posts">View posts</Link>
		</main>
	);
}
