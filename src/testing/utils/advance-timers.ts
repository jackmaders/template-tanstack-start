import { act } from "@testing-library/react";
import { vi } from "vitest";
import { DEFAULT_DELAY_MS } from "@/testing/constants";

export async function advanceTimers(delayMs = DEFAULT_DELAY_MS) {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(delayMs);
	});
}
