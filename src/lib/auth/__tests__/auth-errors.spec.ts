import { toAuthError } from "@/lib/auth/auth-errors";

test.each([
	null,
	"provider failure",
	{},
	{ code: "INVALID_PASSWORD", status: "401" },
	{ code: "INVALID_PASSWORD", status: 399 },
	{ code: "NEW_VENDOR_ERROR", status: 422 },
])("preserves unfamiliar and malformed vendor failures (%s)", (error) => {
	// Act
	const translated = toAuthError(error, "signIn");

	// Assert
	expect(translated).toBe(error);
});
