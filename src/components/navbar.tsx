import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

const EMPTY_NAVIGATION: LinkComponentProps[] = [];

interface NavbarProps extends ComponentProps<"header"> {
	actions?: ReactNode;
	links?: LinkComponentProps[];
}

export function Navbar({
	links = EMPTY_NAVIGATION,
	actions,
	...props
}: NavbarProps) {
	return (
		<header {...props}>
			<nav aria-label="Main navigation">
				<div className="flex items-center justify-between gap-4">
					<Link to="/">LOGO</Link>
					<div className="flex gap-2 max-sm:hidden">
						{links.map((link) => (
							<Link key={link.to} {...link} />
						))}
					</div>
					<div className="flex items-center gap-2 max-sm:hidden">{actions}</div>
					<MobileNavDrawer
						actions={actions}
						className="sm:hidden"
						navigation={links}
					/>
				</div>
			</nav>
		</header>
	);
}

interface MobileNavDrawerProps extends ComponentProps<typeof DrawerTrigger> {
	actions?: ReactNode;
	navigation?: LinkComponentProps[];
}

function MobileNavDrawer({
	navigation = EMPTY_NAVIGATION,
	actions,
	...props
}: MobileNavDrawerProps) {
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
				<DrawerHeader className="flex-row items-center justify-between">
					<DrawerTitle>Menu</DrawerTitle>

					<DrawerClose
						aria-label="Close navigation menu"
						render={<Button size="icon" variant="ghost" />}
					>
						<X />
					</DrawerClose>
				</DrawerHeader>
				<nav aria-label="Mobile navigation" className="flex flex-col gap-2 p-4">
					{navigation.map((link) => (
						<DrawerClose
							key={link.to}
							nativeButton={false}
							render={<Link {...link} />}
						/>
					))}
					<div className="flex flex-wrap items-center gap-2">{actions}</div>
				</nav>
			</DrawerContent>
		</Drawer>
	);
}
