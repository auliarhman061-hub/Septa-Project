import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes dengan clsx + tailwind-merge
 * Gunakan selalu ini untuk className pada komponen
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format Indonesia
 * Contoh: 2026-05-20 -> 20 Mei 2026
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

/**
 * Format tanggal pendek
 * Contoh: 2026-05-20 -> 20/05/2026
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format jam
 * Contoh: "07:30" -> "07.30"
 */
export function formatTime(time: string): string {
  return time.replace(":", ".");
}

/**
 * Capitalize setiap kata
 */
export function capitalize(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Truncate teks
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Generate slug dari teks
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate array dengan angka berurutan
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Parse query string number ke number, fallback ke default
 */
export function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}
