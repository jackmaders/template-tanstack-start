import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { SignInForm } from "@/features/account/components/sign-in-form";

export function SignInDialog() {
	return (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Sign in
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sign in</DialogTitle>
				</DialogHeader>
				<SignInForm />
			</DialogContent>
		</Dialog>
	);
}
