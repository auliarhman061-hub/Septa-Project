import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 *
 * Pada Next.js App Router, kita menggunakan globalThis untuk menyimpan
 * instance PrismaClient agar tidak dibuat ulang setiap hot-reload.
 * Ini penting untuk menghindari connection limit di development.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
