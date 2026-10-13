import { vi } from "vitest";
import { TEST_SESSION } from "@/testing/fixtures/session";

export const ensureSessionFn = vi.fn(() => Promise.resolve(TEST_SESSION));
export const getSessionFn = vi.fn(() => Promise.resolve(TEST_SESSION));
