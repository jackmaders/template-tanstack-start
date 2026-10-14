import type { RolldownOptions } from "rolldown";

export const rolldownOptions: RolldownOptions = {
	output: {
		codeSplitting: {
			groups: [
				{ name: "zod", test: /node_modules\/zod/ },
				{ name: "react-dom", test: /node_modules\/react-dom/ },
				{ name: "base-ui", test: /node_modules\/@base-ui/ },
				{ name: "tanstack", test: /node_modules\/@tanstack/ },
			],
		},
	},
};
