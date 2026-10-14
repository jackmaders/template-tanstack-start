import { vi } from "vitest";
import { TEST_SESSION } from "@/testing/fixtures/session";

export const ensureSession = vi.fn(() => Promise.resolve(TEST_SESSION));
export const getSession = vi.fn(() => Promise.resolve(TEST_SESSION));
