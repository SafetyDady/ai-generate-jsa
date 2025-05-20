import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * รวม className หลายตัวให้ปลอดภัย และจัดลำดับความสำคัญได้ (Tailwind + custom)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

