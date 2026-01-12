import { env } from "./env";

// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// On réutilise la même instance Prisma (pattern Next.js)
import { prisma } from "./prisma"; // utilise lib/prisma.ts

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // ou "mysql", "sqlite", selon ton DB
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  // Optionnel : config de session / callbacks selon BetterAuth
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 jours
  },
});
