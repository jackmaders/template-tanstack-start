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
import { AccountActions } from "@/features/account/components/account-actions";

const navigation: LinkComponentProps[] = [
	{ children: "Home", to: "/" },
	{ children: "About", to: "/about" },
];

interface NavbarProps extends ComponentProps<"header"> {}

export function Navbar({ ...props }: NavbarProps) {
	return (
		<header {...props}>
			<nav aria-label="Main navigation">
				<div className="flex items-center justify-between gap-4">
					<Link to="/">LOGO</Link>
					<div className="max-sm:hidden flex gap-2">
						{navigation.map((link) => (
							<Link key={link.to} {...link} />
						))}
					</div>
					<div className="max-sm:hidden flex items-center gap-2">
						<AccountActions />
					</div>
					<MobileNavDrawer
						actions={<AccountActions />}
						className="sm:hidden"
						navigation={navigation}
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
	navigation = [],
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
