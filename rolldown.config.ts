import type { UserConfig } from "vite";

export const rolldownOptions: NonNullable<
	NonNullable<UserConfig["build"]>["rolldownOptions"]
> = {
	output: {
		codeSplitting: {
			groups: [
				{ name: "zod", test: /node_modules\/zod/u },
				{ name: "react-dom", test: /node_modules\/react-dom/u },
				{ name: "base-ui", test: /node_modules\/@base-ui/u },
				{ name: "tanstack", test: /node_modules\/@tanstack/u },
			],
		},
	},
};
