import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge.
 * This utility function merges Tailwind CSS classes while properly handling conflicts.
 *
 * @param inputs - Array of class values to be combined
 * @returns A string of merged class names
 * @example
 * cn("text-red-500", "bg-blue-200", conditional && "p-4")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
