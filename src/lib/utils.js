import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export const generarIdRandom =()=>'_'+Math.random().toString(36).substring(2,9);

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function camelCaseToTitle(text) {
  const withSpaces = text.replace(/([A-Z])/g, ' $1');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).trim();
}

