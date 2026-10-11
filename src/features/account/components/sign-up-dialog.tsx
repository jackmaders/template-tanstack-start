import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { SignUpForm } from "@/features/account/components/sign-up-form";

export function SignUpDialog() {
	return (
		<Dialog>
			<DialogTrigger render={<Button />}>Sign up</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sign up</DialogTitle>
				</DialogHeader>
				<SignUpForm />
			</DialogContent>
		</Dialog>
	);
}
