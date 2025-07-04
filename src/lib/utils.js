import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export const generarIdRandom =()=>'_'+Math.random().toString(36).substring(2,9);

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
