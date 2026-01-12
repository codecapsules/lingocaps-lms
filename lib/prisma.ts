// lib/prisma.ts
import { PrismaClient } from "./generated/prisma/client";

// Création d'un type global pour stocker Prisma dans dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// On réutilise la même instance en dev pour éviter les multiples connexions
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // optionnel : utile pour debug
    accelerateUrl: process.env.DATABASE_URL || "", // URL pour Prisma Accelerate
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
