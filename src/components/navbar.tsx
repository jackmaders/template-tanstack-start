import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

const links: LinkComponentProps[] = [
	{ children: "Home", to: "/" },
	{ children: "About", to: "/about" },
];

export function Navbar() {
	return (
		<header>
			<nav aria-label="Main navigation">
				<div className="flex items-center justify-between gap-4">
					<Link to="/">LOGO</Link>
					<div className="max-sm:hidden flex gap-2">
						{links.map((props) => (
							<Link key={props.to} {...props} />
						))}
					</div>
					<MobileNavDrawer className="sm:hidden" links={links} />
				</div>
			</nav>
		</header>
	);
}

interface MobileNavDrawerProps extends ComponentProps<typeof DrawerTrigger> {
	links?: LinkComponentProps[];
}

function MobileNavDrawer({ links = [], ...props }: MobileNavDrawerProps) {
	return (
		<Drawer showSwipeHandle={true}>
			<DrawerTrigger
				aria-label="Open navigation menu"
				render={
					<Button size="icon" variant="ghost">
						<Menu />
					</Button>
				}
				{...props}
			/>

			<DrawerContent>
				<DrawerHeader className="flex-row justify-between items-center">
					<DrawerTitle>Menu</DrawerTitle>

					<DrawerClose
						aria-label="Close navigation menu"
						render={<Button size="icon" variant="ghost" />}
					>
						<X />
					</DrawerClose>
				</DrawerHeader>
				<nav aria-label="Mobile navigation" className="flex flex-col gap-2 p-4">
					{links.map((props) => (
						<DrawerClose
							key={props.to}
							nativeButton={false}
							render={<Link {...props} />}
						/>
					))}
				</nav>
			</DrawerContent>
		</Drawer>
	);
}
