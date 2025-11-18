import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return `${error.message}`;
  }

  return "An unexpected error occurred. Please try again.";
}
