import { useActor as useCaffeineActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

/**
 * Returns a typed backend actor instance.
 * Works in anonymous (unauthenticated) context — no Internet Identity required.
 * The portfolio is public; the dashboard uses PIN auth handled entirely by the backend.
 */
export function useActor() {
  return useCaffeineActor(createActor);
}
