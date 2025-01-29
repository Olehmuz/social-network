import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeJWT = (token: string): { [key: string]: any } => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}